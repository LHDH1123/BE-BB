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

    const product = await Product.find({ _id: id });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports.createPost = async (req, res) => {
  try {
    const price = parseInt(req.body.price);
    const discountPercentage = parseInt(req.body.discountPercentage);
    const stock = parseInt(req.body.stock);

    let position;
    if (!req.body.position) {
      const countProduct = await Product.countDocuments();
      position = countProduct + 1;
    } else {
      position = parseInt(req.body.position);
    }

    const { title, category_id, brand_id, thumbnail, status, description } =
      req.body;

    const product = new Product({
      title,
      category_id,
      brand_id,
      price,
      discountPercentage,
      stock,
      thumbnail,
      status,
      position,
      description,
    });

    await product.save();

    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports.deleteProduct = async (req, res) => {
  try {
    const id = req.params.id;

    const result = await Product.updateOne({ _id: id }, { deleted: true });

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    const products = await Product.find({ deleted: false });
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports.editPatch = async (req, res) => {
  try {
    const id = req.params.id;

    const price = parseInt(req.body.price);
    const discountPercentage = parseInt(req.body.discountPercentage);
    const stock = parseInt(req.body.stock);
    const position = parseInt(req.body.position);

    const { title, category_id, brand_id, thumbnail, status, description } =
      req.body;

    const updatedBy = [{ updatedAt: new Date() }];

    const result = await Product.updateOne(
      { _id: id },
      {
        title,
        category_id,
        brand_id,
        price,
        discountPercentage,
        stock,
        thumbnail,
        status,
        position,
        description,
        $push: { updatedBy: updatedBy },
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    const product = await Product.findById(id);
    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports.changeStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const status = req.params.status;

    const result = await Product.updateOne({ _id: id }, { status: status });

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    const product = await Product.find({ _id: id });
    res.status(200).json(product);
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

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: "Invalid or missing IDs" });
    }

    if (!ids.every((id) => mongoose.Types.ObjectId.isValid(id))) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    switch (Key) {
      case key.STATUS:
        await Product.updateMany(
          { _id: { $in: ids } },
          { $set: { status: value } }
        );

        res.status(200).json({
          message: "Status updated successfully!",
        });
        break;

      case key.DELETE:
        await Product.updateMany(
          { _id: { $in: ids } },
          { $set: { deleted: true } }
        );

        res.status(200).json({
          message: "Products deleted successfully!",
        });
        break;

      default:
        res.status(400).json({
          error: "Invalid key provided!",
        });
        break;
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
