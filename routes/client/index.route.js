const cartMiddleware = require("../../middlewares/client/cart.middleware");
const cartRoutes = require("./cart.route");
const userRoutes = require("./user.route");
const likeRoutes = require("./likeProduct.route");
const checkoutRoutes = require("./checkout.route");
const addressRoutes = require("./address.route");
const orderRoutes = require("./order.route");

module.exports = (app) => {
  // app.use(cartMiddleware.cartId);
  app.use("/user", userRoutes);

  app.use("/cart", cartRoutes);

  app.use("/like", likeRoutes);

  app.use("/check-out", checkoutRoutes);

  app.use("/address", addressRoutes);

  app.use("/order", orderRoutes);
};
