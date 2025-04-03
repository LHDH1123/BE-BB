const Cart = require("../../models/cart.model");
const productHelper = require("../../helpers/product");
const Product = require("../../models/product.model");
const Order = require("../../models/order.model");

// [GET] /checkout
module.exports.index = async (req, res) => {
  try {
    const userId = req.params.userId;
    const cart = await Cart.findOne({ user_id: userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    let totalPrice = 0;
    const productsWithDetails = await Promise.all(
      cart.products.map(async (item) => {
        const productInfo = await Product.findOne({
          _id: item.product_id,
          deleted: false,
        }).select("title thumbnail slug price discountPercentage");

        if (!productInfo) return null;

        const priceNew = productHelper.priceNewProduct(productInfo);
        const totalItemPrice = priceNew * item.quantity;
        totalPrice += totalItemPrice;

        return {
          ...item.toObject(),
          priceNew,
          productInfo,
          totalPrice: totalItemPrice,
        };
      })
    );

    res.json({
      cartDetail: {
        ...cart.toObject(),
        products: productsWithDetails.filter(Boolean),
        totalPrice,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// [POST] /checkout/order
module.exports.checkoutPost = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { fullName, phone, address, cart } = req.body; // Nhận giỏ hàng từ body
    const userInfo = { fullName, phone, address };
    console.log({ fullName, phone, address, cart });
    // Kiểm tra giỏ hàng có sản phẩm không
    if (!cart || cart.length === 0) {
      return res.status(400).json({ message: "Giỏ hàng không có sản phẩm" });
    }

    // Lấy thông tin sản phẩm từ giỏ hàng
    const productsOrder = await Promise.all(
      cart.map(async (item) => {
        const productInfo = await Product.findOne({
          _id: item.product_id,
          deleted: false,
        }).select("price discountPercentage");

        // Nếu không tìm thấy sản phẩm, trả về null
        if (!productInfo) {
          return null;
        }

        return {
          product_id: item.product_id,
          price: productInfo.price,
          discountPercentage: productInfo.discountPercentage,
          quantity: item.quantity,
        };
      })
    );


    // Lọc những sản phẩm hợp lệ
    const validProductsOrder = productsOrder.filter(Boolean);

    // Kiểm tra nếu không có sản phẩm hợp lệ nào
    if (validProductsOrder.length === 0) {
      return res.status(400).json({
        message: "Không có sản phẩm hợp lệ trong giỏ hàng",
        invalidItems: cart.filter(
          (item) =>
            !validProductsOrder.some(
              (product) => product.product_id === item.product_id
            )
        ),
      });
    }

    // Tạo đơn hàng mới
    const order = new Order({
      user_id: userId,
      userInfo,
      products: validProductsOrder,
    });

    await order.save();

    // Cập nhật lại giỏ hàng trong database (giỏ hàng của người dùng sẽ trống sau khi thanh toán)
    // Cập nhật lại giỏ hàng: Chỉ xóa những sản phẩm đã thanh toán
    await Cart.updateOne(
      { user_id: userId },
      {
        $pull: {
          products: {
            product_id: { $in: validProductsOrder.map((p) => p.product_id) },
          },
        },
      }
    );

    // Trả về thông tin đơn hàng vừa tạo
    res.json({
      success: true,
      orderId: order.id,
      orderDetails: validProductsOrder, // Trả về chi tiết các sản phẩm trong đơn hàng
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// [GET] /checkout/success/:orderId
module.exports.success = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const order = await Order.findOne({ _id: orderId });
    if (!order) return res.status(404).json({ message: "Order not found" });

    let total = 0;
    const productsWithDetails = await Promise.all(
      order.products.map(async (item) => {
        const productInfo = await Product.findOne({
          _id: item.product_id,
          deleted: false,
        }).select("title thumbnail slug price discountPercentage");
        if (!productInfo) return item;

        const priceNew = productHelper.priceNewProduct(productInfo);
        const totalPrice = priceNew * item.quantity;
        total += totalPrice;
        return { ...item.toObject(), priceNew, productInfo, totalPrice };
      })
    );

    res.json({
      order: {
        ...order.toObject(),
        products: productsWithDetails,
        total,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
