const Account = require("../../models/account.model");
const Role = require("../../models/role.model");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// [GET] /admin/accounts
module.exports.index = async (req, res) => {
  try {
    const records = await Account.find({ deleted: false })
      .select("-password")
      .populate("role_id", "name"); // Tự động lấy tên role

    res.json(records);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// [POST] /admin/accounts/create
module.exports.createPost = async (req, res) => {
  try {
    const {
      thumbnail,
      fullName,
      phone,
      email,
      role_id,
      password,
      confirmPassword,
      status,
    } = req.body;

    // Kiểm tra email tồn tại
    if (await Account.findOne({ email, deleted: false })) {
      return res.status(400).json({ error: `Email ${email} đã tồn tại` });
    }

    // Kiểm tra vai trò hợp lệ
    const role = await Role.findOne({ _id: role_id, deleted: false });
    if (!role) {
      return res.status(400).json({ error: "Vai trò không hợp lệ" });
    }

    // Kiểm tra mật khẩu trùng khớp
    if (confirmPassword !== password) {
      return res.status(400).json({ error: "Mật khẩu không khớp" });
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo tài khoản mới
    const newAccount = new Account({
      thumbnail,
      fullName,
      phone,
      email,
      role_id,
      password: hashedPassword,
      status,
    });

    await newAccount.save();
    res.status(201).json(newAccount);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// [GET] /admin/accounts/:id
module.exports.edit = async (req, res) => {
  try {
    const record = await Account.findOne({
      _id: req.params.id,
      deleted: false,
    }).select("-password");
    if (!record) {
      return res.status(404).json({ error: "Account not found" });
    }
    res.json(record);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// [PATCH] /admin/accounts/edit/:id
module.exports.editPatch = async (req, res) => {
  try {
    const { thumbnail, fullName, phone, email, role_id, status } = req.body;
    const { id } = req.params;

    // Kiểm tra email có tồn tại nhưng không phải của tài khoản đang cập nhật
    if (await Account.findOne({ _id: { $ne: id }, email, deleted: false })) {
      return res.status(400).json({ error: `Email ${email} đã tồn tại` });
    }

    // Kiểm tra vai trò hợp lệ
    if (role_id && !(await Role.findOne({ _id: role_id, deleted: false }))) {
      return res.status(400).json({ error: "Vai trò không hợp lệ" });
    }

    // Cập nhật thông tin tài khoản
    const updatedAccount = await Account.findByIdAndUpdate(
      id,
      { thumbnail, fullName, phone, email, role_id, status },
      { new: true }
    ).select("-password");

    res.json(updatedAccount);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Cập nhật thất bại" });
  }
};

// [DELETE] /admin/accounts/:id
module.exports.delete = async (req, res) => {
  try {
    const id = req.params.id;

    await Account.findByIdAndUpdate(id, { deleted: true });

    res.status(200).json({ message: "Xóa tài khoản thành công" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// [PATCH] /admin/accounts/status/:id
module.exports.changeStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const account = await Account.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    res.status(200).json(account);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// [PATCH] /admin/accounts/change-multiple
module.exports.changeMultiPatch = async (req, res) => {
  try {
    const { ids, key, value } = req.body;

    if (
      !Array.isArray(ids) ||
      ids.length === 0 ||
      !ids.every((id) => mongoose.Types.ObjectId.isValid(id))
    ) {
      return res.status(400).json({ error: "Danh sách ID không hợp lệ" });
    }

    switch (key) {
      case "status":
        await Account.updateMany(
          { _id: { $in: ids } },
          { $set: { status: value } }
        );
        res.status(200).json({ message: "Cập nhật trạng thái thành công!" });
        break;

      case "delete":
        await Account.updateMany(
          { _id: { $in: ids } },
          { $set: { deleted: true } }
        );
        res.status(200).json({ message: "Xóa tài khoản thành công!" });
        break;

      default:
        res.status(400).json({ error: "Key không hợp lệ!" });
        break;
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
