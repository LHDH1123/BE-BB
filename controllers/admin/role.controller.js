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
    const { title, status } = req.body;

    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }

    // Kiểm tra xem vai trò đã tồn tại chưa (không tính vai trò đã bị xóa)
    const existingRole = await Role.findOne({
      title: title.trim(),
      deleted: false,
    });

    if (existingRole) {
      return res.status(400).json({ error: "Vai trò này đã tồn tại" });
    }

    const role = new Role({ title: title.trim(), status });
    await role.save();

    res.status(201).json(role);
  } catch (error) {
    console.error("❌ Error creating role:", error);
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
    const { id } = req.params;
    const { title, status } = req.body;

    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }

    // Kiểm tra xem vai trò đã tồn tại chưa (ngoại trừ chính nó)
    const existingRole = await Role.findOne({
      title: title.trim(),
      _id: { $ne: id }, // Loại trừ chính vai trò đang chỉnh sửa
      deleted: false,
    });

    if (existingRole) {
      return res.status(400).json({ error: "Vai trò này đã tồn tại" });
    }

    await Role.updateOne({ _id: id }, { title: title.trim(), status });

    const role = await Role.findById(id);
    res.status(200).json(role);
  } catch (error) {
    console.error("❌ Error updating role:", error);
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
