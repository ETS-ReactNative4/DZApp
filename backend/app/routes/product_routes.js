var ObjectID = require("mongodb").ObjectID;

module.exports = function(app, db) {
  //insert new product
  app.post("/products", (req, res) => {    
    db
      .collection("products")
      .findOne({ name: new RegExp(req.body.name, "i") }, (err, item) => {
        if (err) res.send({ error: err });
        else {
          if (item) res.send({ error: "Product with this name already exists!" });
          else {
            const product = {
                name: req.body.name,
                price: req.body.price,
                imageUrl: req.body.imageUrl,
                inStock: req.body.inStock,
                criticalStock: req.body.criticalStock
              };
            db.collection("products").insert(product, (err, result) => {
              if (err) res.send({ error: "Unable to insert product" });
              else res.send(result.result);
            });
          }
        }
      });
  });

  //fetchAll
  app.get("/products", (req,res) => {
      db.collection("products")
      .find({},{})
      .toArray((err,item) => {
          if(err) res.send({error: err});
          else res.send(item);
      }); 
  })
};