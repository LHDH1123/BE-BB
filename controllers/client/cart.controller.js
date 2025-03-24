const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");
const productHelper = require("../../helpers/product");

// 🛒 [GET] Lấy thông tin giỏ hàng của người dùng
module.exports.index = async (req, res) => {
  try {
    const { userId } = req.params;

    const cart = await Cart.findOne({ user_id: userId }).populate(
      "products.product_id",
      "title thumbnail slug price discountPercentage"
    );

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    let totalPrice = 0;
    cart.products = cart.products.map((item) => {
      if (item.product_id) {
        item.priceNew = productHelper.priceNewProduct(item.product_id);
        item.totalPrice = item.priceNew * item.quantity;
        totalPrice += item.totalPrice;
      }
      return item;
    });

    cart.totalPrice = totalPrice;
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🛍️ [POST] Thêm sản phẩm vào giỏ hàng
module.exports.addPost = async (req, res) => {
  try {
    const { userId } = req.params;
    const { productId, quantity } = req.body;

    let cart = await Cart.findOne({ user_id: userId });

    if (!cart) {
      cart = new Cart({ user_id: userId, products: [] });
    }

    const existProductInCart = cart.products.find(
      (item) => item.product_id.toString() === productId
    );

    if (existProductInCart) {
      existProductInCart.quantity += parseInt(quantity);
    } else {
      cart.products.push({ product_id: productId, quantity });
    }

    await cart.save();
    res
      .status(200)
      .json({ message: "Sản phẩm đã được thêm vào giỏ hàng", cart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ❌ [DELETE] Xóa sản phẩm khỏi giỏ hàng
module.exports.delete = async (req, res) => {
  try {
    const { userId, productId } = req.params;

    const cart = await Cart.findOneAndUpdate(
      { user_id: userId },
      { $pull: { products: { product_id: productId } } },
      { new: true }
    );

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    res
      .status(200)
      .json({ message: "Sản phẩm đã được xóa khỏi giỏ hàng", cart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🔄 [PATCH] Cập nhật số lượng sản phẩm trong giỏ hàng
module.exports.updateQuantity = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.params;

    const cart = await Cart.findOneAndUpdate(
      { user_id: userId, "products.product_id": productId },
      { $set: { "products.$.quantity": parseInt(quantity) } },
      { new: true }
    );

    if (!cart)
      return res.status(404).json({ message: "Cart or product not found" });

    res
      .status(200)
      .json({ message: "Số lượng sản phẩm đã được cập nhật", cart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
