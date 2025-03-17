const Banner = require("../../models/banner.model");

module.exports.index = async (req, res) => {
  try {
    const banner = await Banner.find({ deleted: false });
    res.status(200).json(banner);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports.createPost = async (req, res) => {
  try {
    const { title, linkHref, thumbnail, status, description } = req.body;
    const newBanner = new Banner({
      title,
      linkHref,
      thumbnail,
      status,
      description,
    });
    await newBanner.save();

    res.status(200).json(newBanner);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports.editPatch = async (req, res) => {
  try {
    const id = req.params.id;
    const { title, linkHref, thumbnail, status, description } = req.body;

    const banner = await Banner.updateOne(
      { _id: id },
      { title, linkHref, thumbnail, status, description }
    );

    res.status(200).json(banner);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports.delete = async (req, res) => {
  try {
    const id = req.params.id;

    const banner = await Banner.updateOne({ _id: id }, { deleted: true });

    res.status(200).json(banner);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports.changeStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const status = req.params.status;

    await Banner.updateOne({ _id: id }, { status: status });

    const Banner = await Banner.find({ _id: id });
    res.status(200).json(Banner);
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
        await Banner.updateMany(
          { _id: { $in: ids } },
          { $set: { status: value } }
        );

        res.status(200).json({
          message: "Banners updated successfully!",
        });
        break;

      case key.DELETE:
        await Banner.updateMany(
          { _id: { $in: ids } },
          { $set: { deleted: true } }
        );

        res.status(200).json({
          message: "Banners deleted successfully!",
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
