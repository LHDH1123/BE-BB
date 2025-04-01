const Order = require("../../models/order.model");

module.exports.index = async (req, res) => {
  try {
    const order = await Order.find({});

    res.status(200).json(order);
  } catch (error) {
    console.error("❌ Lỗi:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

module.exports.getOrderUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const order = await Order.find({ user_id: userId });
    if (!order) {
      return res.status(404).json({ message: "Đơn hàng không tồn tại" });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error("❌ Lỗi:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};
