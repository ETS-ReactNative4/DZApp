var ObjectID = require("mongodb").ObjectID;

module.exports = function(app, db) {
  //insert new subscription
  app.post("/subscriptions", (req, res) => {
    db.collection("subscriptions").insert(req.body, (err, result) => {
      if (err) res.send({ error: "Unable to insert subscription" });
      else res.send(result.result);
    });
  });

  //fetchAll
  app.get("/subscriptions", (req, res) => {
    db
      .collection("subscriptions")
      .find({}, {})
      .toArray((err, item) => {
        if (err) res.send({ error: err });
        else res.send(item);
      });
  });
};
