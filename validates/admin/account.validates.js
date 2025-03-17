module.exports.createPost = async (req, res, next) => {
  if (!req.body.fullName) {
    return res.status(400).json({ error: "Vui lòng nhập họ tên" });
  }
  if (!req.body.phone) {
    return res.status(400).json({ error: "Vui lòng nhập SĐT" });
  }
  if (!req.body.email) {
    return res.status(400).json({ error: "Vui lòng nhập email" });
  }
  if (!req.body.role_id) {
    return res.status(400).json({ error: "Vui lòng chọn vai trò" });
  }
  if (!req.body.password) {
    return res.status(400).json({ error: "Vui lòng nhập mật khẩu" });
  }
  if (!req.body.confirmPassword) {
    return res.status(400).json({ error: "Vui lòng nhập lại mật khẩu" });
  }
  next();
};

module.exports.editPatch = async (req, res, next) => {
  if (!req.body.fullName) {
    return res.status(400).json({ error: "Vui lòng nhập họ tên" });
  }
  if (!req.body.phone) {
    return res.status(400).json({ error: "Vui lòng nhập SĐT" });
  }
  if (!req.body.email) {
    return res.status(400).json({ error: "Vui lòng nhập email" });
  }
  if (!req.body.role_id) {
    return res.status(400).json({ error: "Vui lòng nhập vai trò" });
  }
  if (!req.body.password) {
    return res.status(400).json({ error: "Vui lòng nhập mật khẩu" });
  }
  next();
};
