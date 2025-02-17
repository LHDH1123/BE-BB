const Account = require("../../models/account.model");
const Role = require("../../models/role.model");
const systemConfig = require("../../config/system");
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

    console.log(records);
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
      avatar,
      fullName,
      phone,
      email,
      roleId,
      password,
      confirmPassword,
    } = req.body;

    const emailExists = await Account.findOne({ email, deleted: false });
    if (emailExists) {
      return res.status(400).json({ error: `Email ${email} đã tồn tại` });
    }

    if (confirmPassword === password) {
      const hashedPassword = md5(password);
      const newAccount = new Account({
        avatar,
        fullName,
        phone,
        email,
        roleId,
        password: hashedPassword,
      });
      await newAccount.save();

      res.json(newAccount);
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
    const { avatar, fullName, phone, email, roleId, password } = req.body;
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
      { avatar, fullName, phone, email, roleId, password }
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
