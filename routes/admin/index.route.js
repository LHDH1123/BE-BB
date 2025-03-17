const brandRoutes = require("./brand.route");
const categoryRoutes = require("./category.route");
const productRoutes = require("./product.route");
const roleRoutes = require("./role.route");
const accountRoutes = require("./account.route");
const storeRoutes = require("./store.route");
const bannerRoutes = require("./banner.route");

module.exports = (app) => {
  app.use("/brands", brandRoutes);

  app.use("/categorys", categoryRoutes);

  app.use("/products", productRoutes);

  app.use("/role", roleRoutes);

  app.use("/accounts", accountRoutes);

  app.use("/stores", storeRoutes);

  app.use("/banner", bannerRoutes);
};
