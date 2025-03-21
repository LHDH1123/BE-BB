module.exports.validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  console.log("email:", email);
  console.log("password:", password);

  if (!email) {
    return res.status(400).json({ error: "Vui lòng nhập email" });
  }
  if (!password) {
    return res.status(400).json({ error: "Vui lòng nhập mật khẩu" });
  }

  next(); // Nếu hợp lệ, chuyển tiếp đến controller xử lý đăng nhập
};
