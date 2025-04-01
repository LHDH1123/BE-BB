module.exports.registerPost = async (req, res, next) => {
  if (!req.body.fullName) {
    return res.status(400).json({ error: "Vui lòng nhập họ tên" });
  }
  if (!req.body.email) {
    return res.status(400).json({ error: "Vui lòng nhập email" });
  }
  if (!req.body.password) {
    return res.status(400).json({ error: "Vui lòng nhập mật khẩu" });
  }
  next();
};

module.exports.loginPost = async (req, res, next) => {
  if (!req.body.email) {
    return res.status(400).json({ error: "Vui lòng nhập email" });
  }
  if (!req.body.password) {
    return res.status(400).json({ error: "Vui lòng nhập mật khẩu" });
  }
  next();
};

module.exports.forgotPasswordPost = async (req, res, next) => {
  if (!req.body.email) {
    return res.status(400).json({ error: "Vui lòng nhập email" });
  }
  next();
};

module.exports.resetPasswordPost = async (req, res, next) => {
  if (!req.body.password) {
    return res.status(400).json({ error: "Vui lòng nhập mật khẩu" });
  }
  next();
};
