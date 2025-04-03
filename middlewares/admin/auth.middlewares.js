module.exports.requireAuth = async (req, res, next) => {
  try {
    // Lấy token từ header Authorization
    const authHeader = req.headers.authorization;

    // Kiểm tra xem có Authorization header không và nó có đúng định dạng không
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized. Please log in." });
    }

    // Lấy token từ header
    const token = authHeader.split(" ")[1]; // Tách Bearer và token

    // Kiểm tra token và tìm người dùng
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
