const Account = require("../../models/account.model");
const Role = require("../../models/role.model");

module.exports.requireAuth = async (req, res, next) => {
  try {
    // if (req.cookies.refreshToken) {
    //   next();
    // }
    // Lấy token từ cookie trước
    let token = req.cookies.tokenAdmin;

    // Nếu vẫn không có token, từ chối truy cập
    if (!token) {
      return res.status(401).json({ message: "Unauthorized. Please log in." });
    }

    // Tìm người dùng theo token
    const user = await Account.findOne({ token }).select("-password");
    if (!user) {
      return res
        .status(401)
        .json({ message: "Invalid token. Please log in again." });
    }

    // Lấy role của người dùng
    const role = await Role.findOne({ _id: user.role_id }).select(
      "title permissions"
    );

    res.locals.user = user;
    res.locals.role = role;

    next();
  } catch (error) {
    console.error("Error in requireAuth middleware:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

module.exports.requirePermission = (permissionKey) => {
  return (req, res, next) => {
    const role = res.locals.role;

    if (!role.permissions.includes(permissionKey)) {
      return res
        .status(403)
        .json({ message: "Forbidden. You don't have permission." });
    }

    next();
  };
};
