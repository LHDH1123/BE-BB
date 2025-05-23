const brandRoutes = require("./brand.route");
const categoryRoutes = require("./category.route");
const productRoutes = require("./product.route");
const roleRoutes = require("./role.route");
const accountRoutes = require("./account.route");
const authRoutes = require("./auth.route");
const voucherRoutes = require("./voucher.route");
const reviewRoutes = require("./review.route");
const authMiddleware = require("../../middlewares/admin/auth.middlewares");

module.exports = (app) => {
  app.use("/auth", authRoutes);

  app.use("/admin/brands", authMiddleware.requireAuth, brandRoutes);

  app.use("/admin/categorys", authMiddleware.requireAuth, categoryRoutes);

  app.use("/admin/products", authMiddleware.requireAuth, productRoutes);

  app.use("/role", roleRoutes);

  app.use("/accounts", accountRoutes);

  app.use("/voucher", voucherRoutes);

  app.use("/review", reviewRoutes);
};
