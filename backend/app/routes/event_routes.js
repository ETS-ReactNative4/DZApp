var moment = require("moment-timezone");

module.exports = function(app, db) {
  //insert new event
  app.post("/events", (req, res) => {
    db
      .collection("events")
      .findOne({ name: new RegExp(req.body.name, "i") }, (err, item) => {
        if (err) res.send({ error: err });
        else {
          if (item) res.send({ error: "Event with this name already exists!" });
          else {
            let fromDate = moment(req.body.fromDate).valueOf();
            let toDate = moment(req.body.toDate).valueOf();
            console.log(moment(fromDate).format());
            console.log(moment(toDate).format());

            const event = {
              name: req.body.name,
              fromDate: fromDate,
              toDate: toDate,
              subscriptionFee: req.body.subscriptionFee,
              type: req.body.type
            };
            db.collection("events").insert(event, (err, result) => {
              if (err) res.send({ error: "Unable to insert event" });
              else res.send(result.result);
            });
          }
        }
      });
  });

  //fetchAll
  app.get("/events", (req, res) => {
    db
      .collection("events")
      .find({}, {})
      .toArray((err, item) => {
        if (err) res.send({ error: err });
        else res.send(item);
      });
  });
};
