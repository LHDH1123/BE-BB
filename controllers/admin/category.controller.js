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

module.exports.getCategorySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const record = await Category.findOne({ slug, deleted: false }).lean();
    res.json(record);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports.createPost = async (req, res) => {
  try {
    const { title, parent_id, status } = req.body;

    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }

    // Kiểm tra xem danh mục đã tồn tại chưa (không tính danh mục đã bị xóa)
    const existingCategory = await Category.findOne({
      title: title.trim(),
      deleted: false,
    });
    if (existingCategory) {
      return res.status(400).json({ error: "Danh mục đã tồn tại" });
    }

    const category = new Category({ title: title.trim(), parent_id, status });
    await category.save();

    res.status(201).json(category);
  } catch (error) {
    console.error("❌ Error creating category:", error);
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
    const { title, parent_id, status } = req.body;

    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }

    // Kiểm tra xem danh mục đã tồn tại chưa (ngoại trừ chính nó)
    const existingCategory = await Category.findOne({
      title: title.trim(),
      _id: { $ne: id }, // Loại trừ chính danh mục đang chỉnh sửa
      deleted: false,
    });

    if (existingCategory) {
      return res.status(400).json({ error: "Danh mục đã tồn tại" });
    }

    await Category.updateOne(
      { _id: id },
      { title: title.trim(), parent_id, status }
    );

    const category = await Category.findById(id);
    res.status(200).json(category);
  } catch (error) {
    console.error("❌ Error updating category:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports.changeStatus = async (req, res) => {
  try {
    const { id, status } = req.params;
    await Category.updateOne({ _id: id }, { status: status });
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
