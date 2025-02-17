const cartMiddleware = require("../../middlewares/client/cart.middleware");

const cartRoutes = require("./cart.route");

module.exports = (app) => {
  app.use(cartMiddleware.cartId);

  app.use("/cart", cartRoutes);
};
