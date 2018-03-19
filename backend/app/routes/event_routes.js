var ObjectID = require("mongodb").ObjectID;

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
            const event = {
              name: req.body.name,
              fromDate: req.body.fromDate,
              toDate: req.body.toDate,
              subscriptionFee: req.body.subscriptionFee
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
  app.get("/events", (req,res) => {
      db.collection("events")
      .find({},{})
      .toArray((err,item) => {
          if(err) res.send({error: err});
          else res.send(item);
      }); 
  })
};
