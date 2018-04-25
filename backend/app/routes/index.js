const customerRoutes = require("./customer_routes.js");
const eventRoutes = require("./event_routes.js");
const productRoutes = require("./product_routes");
const topupRoutes = require("./topup_routes");
const subscriptionRoutes = require("./subscription_routes");
const orderRoutes = require("./order_routes");
const rollbackRoutes = require("./rollback_routes");

module.exports = function(app, db) {
  customerRoutes(app, db);
  eventRoutes(app, db);
  productRoutes(app, db);
  topupRoutes(app, db);
  subscriptionRoutes(app, db);
  orderRoutes(app, db);
  rollbackRoutes(app, db);
};
