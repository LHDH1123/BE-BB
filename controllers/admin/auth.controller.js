const bcrypt = require("bcrypt");
const Account = require("../../models/account.model");

// [GET] /admin/auth/login
module.exports.login = async (req, res) => {
  try {
    const token = req.cookies.tokenAdmin;
    if (!token) {
      return res
        .status(401)
        .json({ loggedIn: false, message: "Chưa đăng nhập" });
    }

    const user = await Account.findOne({ token }).select("-password");
    if (!user) {
      return res.status(401).json({
        loggedIn: false,
        message: "Token không hợp lệ hoặc đã hết hạn",
      });
    }

    return res.status(200).json({ loggedIn: true, user });
  } catch (error) {
    console.error("🔴 [GET] /admin/auth/login error:", error);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};

// [POST] /admin/auth/loginPost
module.exports.loginPost = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await Account.findOne({ email, deleted: false });
    if (!user) {
      return res.status(400).json({ error: "Email không tồn tại" });
    }

    if (!user.password) {
      return res.status(500).json({ error: "Không tìm thấy mật khẩu" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Sai mật khẩu" });
    }

    if (user.status === false) {
      return res.status(403).json({ error: "Tài khoản đã bị khóa" });
    }

    // Đăng nhập thành công => lưu tokenAdmin
    res.cookie("tokenAdmin", user.token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });

    return res.status(200).json({
      message: "Đăng nhập thành công",
      loggedIn: true,
    });
  } catch (error) {
    console.error("🔴 [POST] /admin/auth/loginPost error:", error);
    res.status(500).json({ error: "Lỗi máy chủ" });
  }
};

// [GET] /admin/auth/logout
module.exports.logout = (req, res) => {
  res.clearCookie("tokenAdmin", {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  });

  return res.status(200).json({ message: "Đăng xuất thành công" });
};
