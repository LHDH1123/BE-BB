const Product = require("../../models/product.model");

module.exports.index = async (req, res) => {
  try {
    const product = await Product.find({ deleted: false });
    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports.getProduct = async (req, res) => {
  try {
    const id = req.params.id;

    const product = await Product.find({ _id: id }, { deleted: false });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports.getProductSlug = async (req, res) => {
  try {
    const { slug } = req.params;

    // Đảm bảo Mongoose không bị nhầm `_id`
    const product = await Product.findOne({ slug, deleted: false }).lean();

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
