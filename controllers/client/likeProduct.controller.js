const Like = require("../../models/like.model");

module.exports.index = async (req, res) => {
  try {
    const { userId } = req.params;

    const like = await Like.findOne({ user_id: userId });

    if (!like) {
      return res.status(404).json({ message: "Like not found" });
    }

    res.status(200).json(like);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports.addPost = async (req, res) => {
  try {
    const { userId } = req.params;
    const { productId } = req.body;

    let like = await Like.findOne({ user_id: userId });

    if (!like) {
      like = new Like({ user_id: userId, products: [] });
    }

    // Kiểm tra nếu sản phẩm đã tồn tại trong danh sách thích
    const isProductLiked = like.products.some(
      (item) => item._id.toString() === productId
    );

    if (isProductLiked) {
      return res
        .status(200)
        .json({ message: "Sản phẩm đã được thích trước đó", like });
    }

    like.products.push({ _id: productId }); // Đảm bảo thêm đúng định dạng
    await like.save();

    res.status(200).json({ message: "Sản phẩm đã được thích", like });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports.delete = async (req, res) => {
  try {
    const { userId, productId } = req.params;

    // Cập nhật document bằng cách xóa product có _id tương ứng
    let like = await Like.findOneAndUpdate(
      { user_id: userId },
      { $pull: { products: { _id: productId } } },
      { new: true }
    );

    if (!like) {
      return res.status(404).json({ message: "Like not found" });
    }

    // Nếu danh sách sản phẩm rỗng, xóa luôn document Like
    if (like.products.length === 0) {
      await Like.findOneAndDelete({ user_id: userId });
      return res
        .status(200)
        .json({ message: "Danh sách thích đã bị xóa hoàn toàn" });
    }

    res.status(200).json({ message: "Sản phẩm đã được xóa thích", like });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports.deleteLike = async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await Like.deleteOne({ user_id: userId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Không tìm thấy giỏ ưa thích" });
    }

    res.status(200).json({ message: "Giỏ ưa thích đã được xóa" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
