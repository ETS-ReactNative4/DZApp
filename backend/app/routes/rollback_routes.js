var ObjectID = require("mongodb").ObjectID;

module.exports = function(app, db) {
  //insert and process new order
  app.post("/rollbacks", async (req, res) => {
    let rollbacks = req.body;

    if (!Array.isArray(rollbacks)) {
      res.status(400);
      res.send({ error: "Request body not an array" });
      return;
    }

    if (rollbacks.length > 0) {
      rollbacks.forEach(async r => {
        //order or topup?
        if (r.orderId) {
          let order = await db
            .collection("orders")
            .findOne({ localId: r.orderId });
          if (order.amtPayedFromCredit > 0) {
            db
              .collection("customers")
              .findOneAndUpdate(
                { _id: new ObjectID(order.customerId) },
                { $inc: { creditBalance: order.amtPayedFromCredit } },
                (err, result) => {
                  if (err) {
                    console.log(err);
                    res.status(503);
                  } else console.log(result);
                }
              );
          }
          //update remaining balance of subcriptionfee
          if (
            order.amtPayedFromSubscriptionFee &&
            order.amtPayedFromSubscriptionFee > 0
          ) {
            db.collection("subscriptions").findOneAndUpdate(
              { customerId: order.customerId, eventId: order.eventId },
              {
                $inc: { remainingCredit: order.amtPayedFromSubscriptionFee }
              },
              (err, result) => {
                if (err) {
                  console.log(err);
                  res.status(503);
                } else console.log(result);
              }
            );
          }
          //update product stock
          console.log("update products");
          order.orderlines.forEach(ol => {
            db
              .collection("products")
              .findOneAndUpdate(
                { _id: new ObjectID(ol.productId) },
                { $inc: { inStock: ol.quantity } },
                (err, result) => {
                  if (err) {
                    console.log(err);
                    res.status(503);
                  } else console.log(result);
                }
              );
          });
        } else if (r.topupId) {
          let topup = await db
            .collection("topups")
            .findOne({ localId: r.topupId });
          let details = { _id: new ObjectID(topup.customerId) };
          let amount = topup.amount;
          let customerId = topup.customerId;
          db
            .collection("customers")
            .update(
              details,
              { $inc: { creditBalance: -amount } },
              (err, result) => {
                if (err) res.status(503);
                else console.log(result);
              }
            );
        }
      });

      //insert the rollbacks

      db.collection("rollbacks").insertMany(rollbacks, (err, result) => {
        if (err) res.status(503);
        else console.log(result);
      });
    }

    if (res.status !== 503) {
      res.send(200);
    } else {
      res.send({ error: "Probleem bij het syncen van de rollbacks" });
    }
  });
};
