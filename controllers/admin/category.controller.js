const createTreeHelper = require("../../helpers/createTree");
const Category = require("../../models/category.model");

module.exports.index = async (req, res) => {
  try {
    const record = await Category.find({ deleted: false }).sort({
      position: "asc",
    });
    res.json(record);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports.getCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const record = await Category.findById(id);
    res.json(record);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports.createPost = async (req, res) => {
  try {
    const { title, parent_id, thumbnail } = req.body;
    const category = new Category({ title, parent_id, thumbnail });
    await category.save();
    res.json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await Category.updateOne({ _id: id }, { deleted: true });
    const categories = await Category.find({ deleted: false });
    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports.edit = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, parent_id, thumbnail } = req.body;
    await Category.updateOne({ _id: id }, { title, parent_id, thumbnail });
    const category = await Category.findById(id);
    res.json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports.changeStatus = async (req, res) => {
  try {
    const { id, status } = req.params;
    await Category.updateOne({ _id: id }, { deleted: status });
    const category = await Category.findById(id);
    res.json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports.changeMultiPatch = async (req, res) => {
  try {
    const key = {
      STATUS: "status",
      DELETE: "delete",
    };

    const ids = req.body.ids;
    const Key = req.body.key;
    const value = req.body.value;

    switch (Key) {
      case key.STATUS:
        await Category.updateMany(
          {
            _id: { $in: ids },
          },
          {
            $set: { status: value },
          }
        );

        res.json({
          code: 200,
          message: "Cập nhật trạng thái thành công!",
        });
        break;

      case key.DELETE:
        await Category.updateMany(
          {
            _id: { $in: ids },
          },
          {
            $set: { deleted: true },
          }
        );

        res.json({
          code: 200,
          message: "Xóa thành công!",
        });
        break;

      default:
        res.json({
          code: 400,
          message: "Không tồn tại key hợp lệ!",
        });
        break;
    }
  } catch (error) {
    console.error(error);
    res.json({ error: "Internal Server Error" });
  }
};
