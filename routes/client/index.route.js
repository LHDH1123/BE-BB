const cartMiddleware = require("../../middlewares/client/cart.middleware");

const cartRoutes = require("./cart.route");

const userRoutes = require("./user.route");

module.exports = (app) => {
  // app.use(cartMiddleware.cartId);

  app.use("/cart", cartRoutes);

  app.use("/user", userRoutes);
};
