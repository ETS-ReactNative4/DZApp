var ObjectID = require("mongodb").ObjectID;
var bcrypt = require("bcrypt");

module.exports = function(app, db) {
  //inserts an array of topups
  app.post("/topups", (req, res) => {
    const topups = req.body;

    db.collection("topups").insertMany(topups, (err, result) => {
      if (err) res.status(503);
      else {
        for (let index = 0; index < topups.length; index++) {
          let topup = topups[index];
          let details = { _id: new ObjectID(topup.customerId) };
          let amount = topup.amount;
          let customerId = topup.customerId;
          db
            .collection("customers")
            .update(
              details,
              { $inc: { creditBalance: amount } },
              (err, result) => {
                if (err) res.status(503);
                else console.log(result);
              }
            );
        }
        if (res.status !== 503) {
          res.send(200);
        } else {
          res.send();
        }
      }
    });

    // const details = { _id: new ObjectID(topup.customerId) };
    // const amount = Number(topup.amount);
    // db
    //   .collection("customers")
    //   .update(details, { $inc: { creditBalance: amount } }, (err, result) => {
    //     if (err) error = "Kon saldo niet opladen";
    //     else result = result + " - Saldo opgeladen";
    //   });

    // if (error) {
    //   res.send({ error: error });
    // } else {
    //   res.send({ result: result });
    // }
  });
};
