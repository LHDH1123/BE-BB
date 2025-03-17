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

module.exports.createPost = async (req, res) => {
  try {
    let { name, status, thumbnail } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }
    // Đảm bảo status có giá trị mặc định nếu không gửi từ client
    status = status ?? true;

    const brand = new Brand({ name, status, thumbnail });
    await brand.save();

    res.status(201).json(brand);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports.deleteBrand = async (req, res) => {
  try {
    const id = req.params.id;

    await Brand.updateOne({ _id: id }, { deleted: true });

    const brands = await Brand.find({ deleted: false });
    res.status(200).json(brands);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports.editPatch = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, status, thumbnail } = req.body;

    if (name === "") {
      return res.status(400).json({ error: "Name and status are required" });
    }
    console.log(thumbnail);
    await Brand.updateOne({ _id: id }, { name, status, thumbnail });

    const brand = await Brand.findById(id);
    res.status(200).json(brand);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports.changeStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const status = req.params.status;

    await Brand.updateOne(
      { _id: id },
      { status: status, $push: { updatedBy: { updatedAt: new Date() } } }
    );

    const brand = await Brand.findById(id);
    res.status(200).json(brand);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports.changeMultiPatch = async (req, res) => {
  try {
    console.log("Dữ liệu nhận từ frontend:", req.body);
    const { ids, key, value } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: "Ids are required" });
    }

    // const keyMap = {
    //   STATUS: "status",
    //   DELETE: "deleted",
    // };

    // if (!Object.keys(keyMap).includes(key)) {
    //   return res.status(400).json({ error: "Invalid key provided" });
    // }

    switch (key) {
      case "status":
        await Brand.updateMany(
          { _id: { $in: ids } },
          { $set: { status: value } }
        );
        return res.status(200).json({ message: "Status updated successfully" });

      case "deleted":
        await Brand.updateMany(
          { _id: { $in: ids } },
          { $set: { deleted: true } }
        );
        return res.status(200).json({ message: "Deleted successfully" });

      default:
        return res.status(400).json({ error: "Invalid key provided" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
