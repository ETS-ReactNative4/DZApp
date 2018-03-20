//https://medium.freecodecamp.org/building-a-simple-node-js-api-in-under-30-minutes-a07ea9e390d2
const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const bodyParser = require("body-parser");
const db = require("./config/db");

const app = express();

const port = 8000;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

MongoClient.connect(db.url, (err, database) => {
  if (err) return console.log(err);

  require("./app/routes")(app, database);

  var server = app.listen(port, "192.168.0.132", () => {
    var host = server.address().address;
    var port = server.address().port;
    console.log("running at http://" + host + ":" + port);
  });
});
