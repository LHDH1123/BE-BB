const User = require("../../models/user.model");
const ForgotPassword = require("../../models/forgot-password.model");
const sendMailHelper = require("../../helpers/sendMail");
const bcrypt = require("bcryptjs");
const jwtHelper = require("../../helpers/jwt");

module.exports.registerPost = async (req, res) => {
  try {
    const { fullName, email, password, phone } = req.body;

    const existUser = await User.findOne({ email });
    if (existUser) {
      return res.status(400).json({ message: "Email đã tồn tại" });
    }

    // Mã hóa mật khẩu trước khi lưu vào database
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ fullName, email, password: hashedPassword, phone });
    await user.save();

    res.status(201).json({ message: "Đăng ký thành công" });
  } catch (error) {
    console.error("❌ Lỗi đăng ký:", error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

module.exports.loginPost = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, deleted: false });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res
        .status(400)
        .json({ message: "Email hoặc mật khẩu không đúng" });
    }

    const accessToken = jwtHelper.generateAccessToken(user);
    const refreshToken = jwtHelper.generateRefreshToken(user);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    });

    res.status(200).json({ accessToken });
  } catch (error) {
    console.error("❌ Lỗi đăng nhập:", error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

module.exports.logout = (req, res) => {
  res.clearCookie("refreshToken");
  res.status(200).json({ message: "Đăng xuất thành công" });
};

module.exports.forgotPasswordPost = async (req, res) => {
  try {
    const { email } = req.body;

    // Kiểm tra email có tồn tại không
    const user = await User.findOne({ email, deleted: false });
    if (!user) {
      return res.status(400).json({ message: "Email không tồn tại" });
    }

    // Xóa OTP cũ nếu có
    await ForgotPassword.deleteOne({ email });

    // Tạo mã OTP mới (6 số)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Lưu OTP mới vào database, hết hạn sau 3 phút
    const forgotPassword = new ForgotPassword({
      email,
      otp,
      expireAt: new Date(Date.now() + 3 * 60 * 1000), // +3 phút
    });

    await forgotPassword.save();

    // Gửi OTP qua email
    const subject = "Mã OTP xác minh lấy lại mật khẩu";
    const html = `<p>Mã OTP của bạn là: <b>${otp}</b>. Mã này có hiệu lực trong 3 phút.</p>`;

    try {
      sendMailHelper.sendMail(email, subject, html);
    } catch (emailError) {
      console.error("❌ Lỗi gửi email:", emailError);
      return res
        .status(500)
        .json({ message: "Lỗi gửi email", error: emailError.message });
    }

    res.status(200).json({ message: "Mã OTP đã được gửi đến email" });
  } catch (error) {
    console.error("❌ Lỗi forgotPasswordPost:", error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

module.exports.otpPasswordPost = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Kiểm tra OTP có tồn tại không
    const result = await ForgotPassword.findOne({ email, otp });

    if (!result) {
      return res
        .status(400)
        .json({ message: "OTP không hợp lệ hoặc đã hết hạn" });
    }

    // Kiểm tra xem OTP có hết hạn không
    if (result.expireAt < new Date()) {
      await ForgotPassword.deleteOne({ email }); // Xóa OTP hết hạn
      return res
        .status(400)
        .json({ message: "OTP đã hết hạn, vui lòng yêu cầu lại" });
    }

    // Xác thực thành công -> Tìm user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }

    // Trả về token hoặc thông báo thành công
    res
      .status(200)
      .json({ message: "OTP hợp lệ, tiếp tục đặt lại mật khẩu", email });
  } catch (error) {
    console.error("❌ Lỗi xác thực OTP:", error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

module.exports.resetPasswordPost = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Kiểm tra xem email có hợp lệ không
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }

    // Mã hóa mật khẩu mới bằng bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Cập nhật mật khẩu mới
    await User.updateOne({ email }, { password: hashedPassword });

    // Xóa OTP sau khi đổi mật khẩu thành công
    await ForgotPassword.deleteOne({ email });

    res.status(200).json({ message: "Đặt lại mật khẩu thành công" });
  } catch (error) {
    console.error("❌ Lỗi đặt lại mật khẩu:", error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};
