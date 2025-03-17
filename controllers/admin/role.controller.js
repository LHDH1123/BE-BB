const Role = require("../../models/role.model");

module.exports.index = async (req, res) => {
  try {
    const role = await Role.find({ deleted: false });
    res.status(200).json(role);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports.getRole = async (req, res) => {
  try {
    const id = req.params.id;
    const role = await Role.findOne({ _id: id, deleted: false });

    res.status(200).json(role);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports.createPost = async (req, res) => {
  try {
    const title = req.body.title;
    const status = req.body.status;

    const role = new Role({ title, status });
    await role.save();

    res.status(200).json(role);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports.editPatch = async (req, res) => {
  try {
    const id = req.params.id;
    const permissions = req.body.permissions;

    await Role.updateOne({ _id: id }, { permissions: permissions });

    const role = await Role.find({ _id: id });
    res.status(200).json(role);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports.editPatchData = async (req, res) => {
  try {
    const id = req.params.id;
    const { title, status } = req.body;

    await Role.updateOne({ _id: id }, { title, status });

    const role = await Role.find({ _id: id });
    res.status(200).json(role);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports.changeStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const status = req.params.status;

    await Role.updateOne({ _id: id }, { status: status });

    const role = await Role.find({ _id: id });
    res.status(200).json(role);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports.delete = async (req, res) => {
  try {
    const id = req.params.id;

    await Role.updateOne({ _id: id }, { deleted: true });

    const role = await Role.find({ deleted: false });
    res.status(200).json(role);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// module.exports.permissionsPatch = async (req, res) => {
//   try {
//     const permissions = JSON.parse(req.body.permissions);
//     for (const item of permissions) {
//       await Role.updateOne({ _id: item.id }, { permissions: item.permission });
//     }

//     res.status(200).json({ message: "Permissions updated successfully" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };
