const Cart = require("../../models/cart.model");
const productHelper = require("../../helpers/product");
const Product = require("../../models/product.model");
const Order = require("../../models/order.model");
const Voucher = require("../../models/voucher.model");

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
    const { fullName, phone, address, cart, isCheckout, voucher_id } = req.body;
    const userInfo = { fullName, phone, address };

    if (!cart || cart.length === 0) {
      return res.status(400).json({ message: "Giỏ hàng không có sản phẩm" });
    }

    let total = 0;

    const productsOrder = await Promise.all(
      cart.map(async (item) => {
        const productInfo = await Product.findOne({
          _id: item.product_id,
          deleted: false,
        }).select("price discountPercentage stock");

        if (!productInfo || productInfo.stock <= 0) return null;

        // Ép quantity không vượt quá stock
        const actualQuantity =
          item.quantity > productInfo.stock ? productInfo.stock : item.quantity;

        const priceNew = productHelper.priceNewProduct(productInfo);
        const itemTotal = priceNew * actualQuantity;
        total += itemTotal;

        return {
          product_id: item.product_id,
          price: productInfo.price,
          discountPercentage: productInfo.discountPercentage,
          quantity: actualQuantity,
        };
      })
    );

    const validProductsOrder = productsOrder.filter(Boolean);

    if (validProductsOrder.length === 0) {
      return res.status(400).json({
        message: "Không có sản phẩm hợp lệ trong giỏ hàng",
      });
    }

    // Tính giảm giá từ voucher nếu có
    let discountAmount = 0;
    if (voucher_id) {
      const voucher = await Voucher.findOne({ _id: voucher_id });
      if (voucher && voucher.discount) {
        discountAmount = (total * voucher.discount) / 100;
      }
    }

    const totalAfterVoucher = Math.round(total - discountAmount + 12000);

    // Tạo đơn hàng mới
    const order = new Order({
      user_id: userId,
      userInfo,
      products: validProductsOrder,
      isCheckout,
      voucher_id,
      total: totalAfterVoucher,
    });

    await order.save();

    // ✅ Trừ stock & cập nhật status nếu cần
    await Promise.all(
      validProductsOrder.map(async (item) => {
        const product = await Product.findById(item.product_id);
        if (!product) return;

        const newStock = product.stock - item.quantity;

        await Product.updateOne(
          { _id: item.product_id },
          {
            $inc: { stock: -item.quantity },
            ...(newStock <= 0 && { status: false }),
          }
        );
      })
    );

    // ✅ Xóa các sản phẩm vừa đặt khỏi giỏ hàng
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

    res.json({
      success: true,
      orderId: order.id,
      orderDetails: validProductsOrder,
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

    const voucher = order.voucher_id
      ? await Voucher.findOne({ _id: order.voucher_id })
      : null;

    const productsWithDetails = await Promise.all(
      order.products.map(async (item) => {
        const productInfo = await Product.findOne({
          _id: item.product_id,
          deleted: false,
        }).select("title thumbnail slug price discountPercentage");

        if (!productInfo) return item;

        const priceNew = productHelper.priceNewProduct(productInfo);
        const totalPrice = priceNew * item.quantity;

        return {
          ...item.toObject(),
          priceNew,
          productInfo,
          totalPrice,
        };
      })
    );

    const validProducts = productsWithDetails.filter(
      (p) => p.totalPrice !== undefined
    );
    const total = validProducts.reduce((sum, item) => sum + item.totalPrice, 0);

    const discount = voucher?.discount || 0;
    const totalVoucher = Math.round(total - (total * discount) / 100 + 12000);

    res.json({
      order: {
        ...order.toObject(),
        products: validProducts,
        total,
        discount,
        totalVoucher,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
