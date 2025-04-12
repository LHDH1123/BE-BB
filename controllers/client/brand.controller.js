const Brand = require("../../models/brand.model");

module.exports.index = async (req, res) => {
  try {
    const brands = await Brand.find({ deleted: false });
    res.status(200).json(brands);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports.getBrand = async (req, res) => {
  try {
    const id = req.params.id;
    const brand = await Brand.findOne({ _id: id, deleted: false });

    res.status(200).json(brand);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports.getBrandName = async (req, res) => {
  try {
    const name = req.params.name;
    const brand = await Brand.findOne({ name, deleted: false }).lean();

    res.status(200).json(brand);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
