var ObjectID = require("mongodb").ObjectID;
var bcrypt = require("bcrypt");

module.exports = function(app, db) {
  // //findById
  // app.get("/customers/id/:id", (req, res) => {
  //   const id = req.params.id;
  //   const details = { _id: new ObjectID(id) };
  //   db.collection("customers").findOne(details, (err, item) => {
  //     if (err) res.send({ error: "An error occurred" });
  //     else res.send(item);
  //   });
  // });

  // //findByUserName
  // app.get("/customers/username/:userName", (req, res) => {
  //   const userName = req.params.userName;
  //   //case insensitive comparison
  //   const details = { userName: new RegExp(userName, "i") };
  //   db.collection("customers").findOne(details, (err, item) => {
  //     if (err) res.send({ error: "An error occurred" });
  //     else {
  //       console.log(item);
  //     }
  //   });
  // });

  //fetchAll
  app.get("/customers", (req, res) => {
    const values = db
      .collection("customers")
      .find({},{hashedPass: 0})
      .toArray((err, item) => {
        if (err) res.send({ error: err });
        else res.send(item);
      });
  });

  //insert new customer
  app.post("/customers", (req, res) => {
    //check if userName exists:
    const userName = req.body.userName;
    //case insensitive comparison
    const details = { userName: new RegExp(userName, "i") };
    db.collection("customers").findOne(details, (err, item) => {
      if (err) res.send({ error: err });
      else {
        if (item) res.send({ error: "Username already exists!" });
        else {
          //unique username -> proceed with insert
          const customer = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            role: req.body.role,
            creditBalance: Number(req.body.creditBalance),
            userName: req.body.userName
          };
          bcrypt.hash(req.body.password, 10, (err, hash) => {
            if (err) {
              res.send({ error: "Unable to hash password" });
              return;
            } else {
              //no plain text pass in db
              customer.hashedPass = hash;
              //insert the customer object
              db.collection("customers").insert(customer, (err, result) => {
                if (err) res.send({ error: "An error occurred" });
                else
                  //return number of inserts - should be 1
                  console.log (result);
                  res.send(result.result);
              });
            }
          });
        }
      }
    });
  });

  // //update customer: all fields
  // app.put("/customers/:id", (req, res) => {
  //   const id = req.params.id;
  //   const details = { _id: new ObjectID(id) };
  //   const customer = {
  //     firstName: req.body.firstName,
  //     lastName: req.body.lastName,
  //     role: req.body.role,
  //     creditBalance: Number(req.body.creditBalance),
  //     userName: req.body.creditBalance,
  //     hashedPass: req.body.hashedPass,
  //     salt: req.body.salt
  //   };
  //   db.collection("customers").update(details, customer, (err, result) => {
  //     if (err) res.send({ error: "An error occurred" });
  //     else res.send(customer);
  //   });
  // });

  //update customer: creditBalance
  //balanceChange in requestBody determines which value will be added (positive or negative) to the current balance
  app.put("/customers/updateBalance/:id", (req, res) => {
    const id = req.params.id;
    const details = { _id: new ObjectID(id) };
    const balanceChange = Number(req.body.balanceChange);

    db
      .collection("customers")
      .update(
        details,
        { $inc: { creditBalance: balanceChange } },
        (err, result) => {
          if (err) res.send({ error: err });
          else res.send(result);
        }
      );
  });

  //authenticate cashier
  app.post("/customers/login", (req, res) => {
    const userName = req.body.userName;
    const password = req.body.password;
    console.log(userName);
    console.log(password);

    if (!userName || userName == "" || !password || password == "") {
      res.send({ error: "No username or password provided" });
      return;
    } else {
      db.collection("customers").findOne(
        {userName: new RegExp(userName,'i'),role: 'cashier'},
        {hashedPass:1},(err,item) => {
          if(err) res.send({error: "Fout bij opvragen kassierinfo"})
          else{
            if(!item) res.send({error: "Ongeldig wachtwoord of gebruikersnaam"})
            else{
              bcrypt.compare(password,item.hashedPass,(err,result) => {
                if(err) res.send({error: "Fout bij vergelijken wachtwoord"});
                else{
                  if(result)
                  res.send({id: item._id});
                  else
                  res.send({error: "Ongeldig wachtwoord of gebruikersnaam"})
                }
              })
            }
          }
        }
      );
    }
  });
};
