var ObjectID = require("mongodb").ObjectID;

module.exports = function(app, db) {
  //insert and process new order
  app.post("/orders", async (req, res) => {
    let orders = req.body;

    // let products = await db
    //   .collection("products")
    //   .find()
    //   .toArray();
    // console.log(products);

    if (!Array.isArray(orders)) {
      res.status(400);
      res.send({ error: "Request body not an array" });
      return;
    }

    orders.forEach(async o => {
      //update customer creditBalance
      if (o.amtPayedFromCredit > 0) {
        console.log("update customers");
        db
          .collection("customers")
          .findOneAndUpdate(
            { _id: new ObjectID(o.customerId) },
            { $inc: { creditBalance: -o.amtPayedFromCredit } },
            (err, result) => {
              if (err) {
                console.log(err);
                res.status(503);
              } else console.log(result);
            }
          );
        console.log();
        console.log();
      }
      //update remaining balance of subcriptionfee
      if (o.amtPayedFromSubscriptionFee && o.amtPayedFromSubscriptionFee > 0) {
        console.log("update subscriptions");
        db
          .collection("subscriptions")
          .findOneAndUpdate(
            { customerId: o.customerId, eventId: o.eventId },
            { $inc: { remainingCredit: -o.amtPayedFromSubscriptionFee } },
            (err, result) => {
              if (err) {
                console.log(err);
                res.status(503);
              } else console.log(result);
            }
          );
        console.log();
        console.log();
      }
      //update product stock
      console.log("update products");
      o.orderlines.forEach(ol => {
        db
          .collection("products")
          .findOneAndUpdate(
            { _id: new ObjectID(ol.productId) },
            { $inc: { inStock: -ol.quantity } },
            (err, result) => {
              if (err) {
                console.log(err);
                res.status(503);
              } else console.log(result);
            }
          );
      });
      console.log();
      console.log();
    });

    //insert the orders
    db.collection("orders").insertMany(orders, (err, result) => {
      if (err) res.status(503);
      else console.log(result);
    });

    if (res.status !== 503) {
      res.send(200);
    } else {
      res.send({ error: "Probleem bij het syncen van de bestellingen" });
    }
  });
};
