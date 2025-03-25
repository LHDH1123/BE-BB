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
    const userInfo = req.body;
    const cart = await Cart.findOne({ user_id: userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const productsOrder = await Promise.all(
      cart.products.map(async (item) => {
        const productInfo = await Product.findOne({
          _id: item.product_id,
          deleted: false,
        }).select("price discountPercentage");
        if (!productInfo) return null;
        return {
          product_id: item.product_id,
          price: productInfo.price,
          discountPercentage: productInfo.discountPercentage,
          quantity: item.quantity,
        };
      })
    );

    const validProductsOrder = productsOrder.filter(Boolean);

    const order = new Order({
      cart_id: userId,
      userInfo,
      products: validProductsOrder,
    });
    await order.save();

    await Cart.updateOne({ user_id: userId }, { products: [] });
    res.json({ success: true, orderId: order.id });
  } catch (error) {
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
