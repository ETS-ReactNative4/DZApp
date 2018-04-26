module.exports = function(app, db) {
  //insert and process new order
  app.post("/closeouts", async (req, res) => {
    let closeouts = req.body;

    console.log(JSON.stringify(closeouts))

    if (!Array.isArray(closeouts)) {
      res.status(400);
      res.send({ error: "Request body not an array" });
      return;
    }

    if (closeouts.length > 0) {
      console.log("POST CLOSEOUTS");

      db.collection("closeouts").insertMany(closeouts, (err, result) => {
        if (err) res.status(503);
      });

      if (res.status !== 503) {
        res.send(200);
      } else {
        res.send({ error: "Probleem bij het syncen van de closeouts" });
      }
    }
  });
};
