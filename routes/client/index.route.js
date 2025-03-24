const cartMiddleware = require("../../middlewares/client/cart.middleware");
const cartRoutes = require("./cart.route");
const userRoutes = require("./user.route");
const likeRoutes = require("./likeProduct.route");

module.exports = (app) => {
  // app.use(cartMiddleware.cartId);
  app.use("/user", userRoutes);

  app.use("/cart", cartRoutes);

  app.use("/like", likeRoutes);
};
