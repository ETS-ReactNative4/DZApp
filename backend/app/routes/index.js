const customerRoutes = require("./customer_routes.js");
const eventRoutes = require("./event_routes.js");
const productRoutes = require("./product_routes");
const topupRoutes = require("./topup_routes");

module.exports = function(app, db) {
  customerRoutes(app, db);
  eventRoutes(app, db);
  productRoutes(app, db);
  topupRoutes(app, db);
};
