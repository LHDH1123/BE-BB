const brandRoutes = require("./brand.route");
const categoryRoutes = require("./category.route");

module.exports = (app) => {
  app.use("/brands", brandRoutes);

  app.use("/category", categoryRoutes);
};
