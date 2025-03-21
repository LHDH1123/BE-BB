const bcrypt = require("bcrypt");
const Account = require("../../models/account.model");
const systemConfig = require("../../config/system");

// [GET] /admin/auth/login
module.exports.login = async (req, res) => {
  try {
    const user = await Account.findOne({ token: req.cookies.token });
    if (req.cookies.token && user) {
      return res.redirect(`${systemConfig.prefixAdmin}`);
    }
    return res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Lỗi máy chủ" });
  }
};

// [POST] /admin/auth/login
module.exports.loginPost = async (req, res) => {
  try {
    console.log("Request body:", req.body); // Kiểm tra dữ liệu gửi lên

    const { email, password } = req.body;

    // Kiểm tra tài khoản
    const user = await Account.findOne({ email: email, deleted: false });
    if (!user) return res.status(400).json({ error: "Email không tồn tại" });

    if (!user.password)
      return res
        .status(500)
        .json({ error: "Lỗi tài khoản: Không tìm thấy mật khẩu" });

    // So sánh mật khẩu nhập vào với mật khẩu đã hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Sai mật khẩu!" });

    if (user.status === "inactive")
      return res.status(400).json({ error: "Tài khoản đã bị khóa!" });

    // Lưu token vào cookie
    res.cookie("token", user.token, {
      httpOnly: false,
      secure: true,
      sameSite: "Strict",
    });

    return res
      .status(200)
      .json({ message: "Đăng nhập thành công", token: user.token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Lỗi máy chủ" });
  }
};

// [GET] /admin/auth/logout
module.exports.logout = (req, res) => {
  res.clearCookie("token");
  return res.status(200).json({ message: "Đăng xuất thành công!" });
};
