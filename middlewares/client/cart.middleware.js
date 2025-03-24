const Cart = require("../../models/cart.model");

module.exports.cartId = async (req, res, next) => {
  try {
    let cartId = req.cookies.cartId;
    let cart;

    // Nếu chưa có giỏ hàng, tạo mới
    if (!cartId) {
      cart = new Cart({ products: [] });
      await cart.save();

      const expiresCookie = 365 * 24 * 60 * 60 * 1000; // 1 năm

      res.cookie("cartId", cart._id.toString(), {
        expires: new Date(Date.now() + expiresCookie),
        httpOnly: true, // Bảo mật cookie
      });
    } else {
      cart = await Cart.findById(cartId);

      // Nếu không tìm thấy giỏ hàng, tạo mới
      if (!cart) {
        cart = new Cart({ products: [] });
        await cart.save();

        res.cookie("cartId", cart._id.toString(), {
          expires: new Date(Date.now() + expiresCookie),
          httpOnly: true,
        });
      }
    }

    // Tính tổng số lượng sản phẩm trong giỏ hàng
    cart.totalQuantity =
      cart.products?.reduce((sum, item) => sum + item.quantity, 0) || 0;

    res.locals.miniCart = cart;

    next();
  } catch (error) {
    console.error("Lỗi middleware giỏ hàng:", error);
    res.status(500).json({ error: "Lỗi server" });
  }
};
