const brandRoutes = require("./brand.route");
const categoryRoutes = require("./category.route");
const productRoutes = require("./product.route");
const roleRoutes = require("./role.route");
const accountRoutes = require("./account.route");
const storeRoutes = require("./store.route");
const bannerRoutes = require("./banner.route");
const authRoutes = require("./auth.route");
const voucherRoutes = require("./voucher.route");
const authMiddleware = require("../../middlewares/admin/auth.middlewares");

module.exports = (app) => {
  app.use("/brands", authMiddleware.requireAuth, brandRoutes);

  app.use("/categorys", authMiddleware.requireAuth, categoryRoutes);

  app.use("/products", authMiddleware.requireAuth, productRoutes);

  app.use("/role", authMiddleware.requireAuth, roleRoutes);

  app.use("/accounts", authMiddleware.requireAuth, accountRoutes);

  app.use("/stores", authMiddleware.requireAuth, storeRoutes);

  app.use("/banner", authMiddleware.requireAuth, bannerRoutes);

  app.use("/auth", authRoutes);

  app.use("/voucher", authMiddleware.requireAuth, voucherRoutes);
};
