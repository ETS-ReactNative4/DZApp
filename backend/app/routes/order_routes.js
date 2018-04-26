var ObjectID = require("mongodb").ObjectID;

module.exports = function(app, db) {
  //insert and process new order
  app.post("/orders", async (req, res) => {
    let orders = req.body;

    if (!Array.isArray(orders)) {
      res.status(400);
      res.send({ error: "Request body not an array" });
      return;
    }

    if (orders.length > 0) {
      console.log("POST ORDERS");

      orders.forEach(async o => {
        //update customer creditBalance
        if (o.amtPayedFromCredit > 0) {
          db
            .collection("customers")
            .findOneAndUpdate(
              { _id: new ObjectID(o.customerId) },
              { $inc: { creditBalance: -o.amtPayedFromCredit } },
              (err, result) => {
                if (err) {
                  res.status(503);
                }
              }
            );
        }
        //update remaining balance of subcriptionfee
        if (
          o.amtPayedFromSubscriptionFee &&
          o.amtPayedFromSubscriptionFee > 0
        ) {
          db
            .collection("subscriptions")
            .findOneAndUpdate(
              { customerId: o.customerId, eventId: o.eventId },
              { $inc: { remainingCredit: -o.amtPayedFromSubscriptionFee } },
              (err, result) => {
                if (err) {
                  res.status(503);
                }
              }
            );
        }
        //update product stock
        o.orderlines.forEach(ol => {
          db
            .collection("products")
            .findOneAndUpdate(
              { _id: new ObjectID(ol.productId) },
              { $inc: { inStock: -ol.quantity } },
              (err, result) => {
                if (err) {
                  res.status(503);
                }
              }
            );
        });
      });

      //insert the orders
      db.collection("orders").insertMany(orders, (err, result) => {
        if (err) res.status(503);
        
      });
    }

    if (res.status !== 503) {
      res.send(200);
    } else {
      res.send({ error: "Probleem bij het syncen van de bestellingen" });
    }
  });
};
