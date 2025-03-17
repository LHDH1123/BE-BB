const Store = require("../../models/store.model");

module.exports.index = async (req, res) => {
  try {
    const store = await Store.find({ deleted: false });
    res.status(200).json(store);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports.getStore = async (req, res) => {
  try {
    const id = req.params.id;
    const store = await Store.findOne({ _id: id, deleted: false });

    res.status(200).json(store);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports.createPost = async (req, res) => {
  try {
    const { name, local, city, phone, timeOpen, status } = req.body;

    const store = new Store({ name, local, city, phone, timeOpen, status });
    await store.save();

    res.status(200).json(store);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports.editPatch = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, local, city, phone, timeOpen, status } = req.body;

    await Store.updateOne(
      { _id: id },
      { name, local, city, phone, timeOpen, status }
    );

    const store = await Store.find({ _id: id });
    res.status(200).json(store);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports.changeStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const status = req.params.status;

    await Store.updateOne({ _id: id }, { status: status });

    const store = await Store.find({ _id: id });
    res.status(200).json(store);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports.delete = async (req, res) => {
  try {
    const id = req.params.id;

    await Store.updateOne({ _id: id }, { deleted: true });

    const store = await Store.find({ deleted: false });
    res.status(200).json(store);
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
        await Store.updateMany(
          { _id: { $in: ids } },
          { $set: { status: value } }
        );

        res.status(200).json({
          message: "Status updated successfully!",
        });
        break;

      case key.DELETE:
        await Store.updateMany(
          { _id: { $in: ids } },
          { $set: { deleted: true } }
        );

        res.status(200).json({
          message: "Stores deleted successfully!",
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
