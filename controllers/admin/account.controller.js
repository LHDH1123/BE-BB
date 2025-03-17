const Account = require("../../models/account.model");
const Role = require("../../models/role.model");
const mongoose = require("mongoose");
const md5 = require("md5");

// [GET] /admin/accounts
module.exports.index = async (req, res) => {
  try {
    const find = { deleted: false };
    const records = await Account.find(find).select("-password -token");

    for (const record of records) {
      const role = await Role.findOne({ _id: record.role_id, deleted: false });
      record.role = role;
    }

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

    const emailExists = await Account.findOne({ email, deleted: false });
    if (emailExists) {
      return res.status(400).json({ error: `Email ${email} đã tồn tại` });
    }

    if (confirmPassword === password) {
      const hashedPassword = md5(password);
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

      res.status(200).json(newAccount); // ✅ Đúng cú pháp mới
    } else {
      return res.status(400).json({ error: "Mật khẩu không khớp" });
    }
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
    });
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
    const { thumbnail, fullName, phone, email, roleId, status } = req.body;
    const { id } = req.params;

    // Kiểm tra xem email có tồn tại trên hệ thống nhưng không phải của tài khoản đang cập nhật không
    const emailExists = await Account.findOne({
      _id: { $ne: id },
      email,
      deleted: false,
    });

    if (emailExists) {
      return res.status(400).json({ error: `Email ${email} đã tồn tại` });
    }

    // Cập nhật thông tin tài khoản
    await Account.updateOne(
      { _id: id },
      { thumbnail, fullName, phone, email, roleId, status }
    );

    // Lấy lại thông tin tài khoản đã cập nhật
    const account = await Account.findOne({ _id: id });

    res.json(account);
  } catch (error) {
    res.status(500).json({ error: "Cập nhật thất bại" });
  }
};

module.exports.delete = async (req, res) => {
  try {
    const id = req.params.id;

    await Account.updateOne(
      {
        _id: id,
      },
      { deleted: true }
    );

    const record = await Account.find({ deleted: false });

    res.json(record);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports.changeStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const status = req.params.status;

    await Account.updateOne({ _id: id }, { status: status });

    const account = await Account.find({ _id: id });
    res.status(200).json(account);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports.changeMultiPatch = async (req, res) => {
  try {
    // const key = {
    //   STATUS: "status",
    //   DELETE: "delete",
    // };

    const ids = req.body.ids;
    const Key = req.body.key;
    const value = req.body.value;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res
        .status(400)
        .json({ error: "Invalid or missing IDs", receivedIds: ids });
    }

    if (!ids.every((id) => mongoose.Types.ObjectId.isValid(id))) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    switch (Key) {
      case "status":
        await Account.updateMany(
          { _id: { $in: ids } },
          { $set: { status: value } }
        );

        res.status(200).json({
          message: "Status updated successfully!",
        });
        break;

      case "delete":
        await Account.updateMany(
          { _id: { $in: ids } },
          { $set: { deleted: true } }
        );

        res.status(200).json({
          message: "Account deleted successfully!",
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
