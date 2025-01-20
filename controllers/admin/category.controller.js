// const systemConfig = require("../../config/system");
const createTreeHelper = require("../../helpers/createTree");

const Category = require("../../models/category.model");
/**
 * @swagger
 * tags:
 *   - name: Categories
 *     description: API for managing categories
 */
// [GET] /adminbb/categorys
module.exports.index = async (req, res) => {
  const record = await Category.find({
    deleted: false,
  }).sort({ position: "asc" });

  const newRecord = createTreeHelper.tree(record);
  res.json(newRecord);
};
