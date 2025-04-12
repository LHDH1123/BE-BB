
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
