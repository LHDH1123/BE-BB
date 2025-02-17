module.exports.createPost = async (req, res, next) => {
  if (!req.body.fullName) {
    res.json("error", `Vui lòng nhập họ tên`);
    return;
  }
  if (!req.body.phone) {
    res.json("error", `Vui lòng nhập SĐT`);
    return;
  }
  if (!req.body.email) {
    res.json("error", `Vui lòng nhập email`);
    return;
  }
  if (!req.body.roleId) {
    res.json("error", `Vui lòng nhập vai trò`);
    return;
  }
  if (!req.body.password) {
    res.json("error", `Vui lòng nhập mật khẩu`);
    return;
  }
  if (!req.body.confirmPassword) {
    res.json("error", `Vui lòng nhập lại mật khẩu`);
    return;
  }
  next();
};
module.exports.editPatch = async (req, res, next) => {
  if (!req.body.fullName) {
    res.json("error", `Vui lòng nhập họ tên`);
    return;
  }
  if (!req.body.phone) {
    res.json("error", `Vui lòng nhập SĐT`);
    return;
  }
  if (!req.body.email) {
    res.json("error", `Vui lòng nhập email`);
    return;
  }
  if (!req.body.roleId) {
    res.json("error", `Vui lòng nhập vai trò`);
    return;
  }
  if (!req.body.password) {
    res.json("error", `Vui lòng nhập mật khẩu`);
    return;
  }
  next();
};
