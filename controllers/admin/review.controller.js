const Review = require("../../models/review.model");
const User = require("../../models/user.model");
const Product = require("../../models/product.model");

exports.index = async (req, res) => {
  try {
    const interactions = await Review.find({})
      .sort({ createdAt: -1 }) // mới nhất lên đầu
      .lean();

    const userIds = [...new Set(interactions.map((i) => i.user_id.toString()))];
    const productIds = [
      ...new Set(interactions.map((i) => i.product_id.toString())),
    ];

    const [users, products] = await Promise.all([
      User.find({ _id: { $in: userIds } }).lean(),
      Product.find({ _id: { $in: productIds } }).lean(),
    ]);

    const userMap = users.reduce((acc, u) => {
      acc[u._id.toString()] = u.fullName;
      return acc;
    }, {});

    const productMap = products.reduce((acc, p) => {
      acc[p._id.toString()] = p.title;
      return acc;
    }, {});

    const enrichedInteractions = interactions.map((review) => ({
      ...review,
      userName: userMap[review.user_id.toString()] || "Unknown user",
      productName:
        productMap[review.product_id.toString()] || "Unknown product",
    }));

    res.json({ interactions: enrichedInteractions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Like / Unlike
exports.toggleLike = async (req, res) => {
  const { userId, productId } = req.params;

  const interaction = await Review.findOneAndUpdate(
    { user_id: userId, product_id: productId },
    [{ $set: { liked: { $not: "$liked" } } }],
    { new: true, upsert: true }
  );

  res.json({ liked: interaction.liked });
};

// Đánh giá sản phẩm
exports.createOrUpdateReview = async (req, res) => {
  const { userId, productId } = req.params;
  const { comment, thumbnail } = req.body;
  const rating = parseInt(req.body.rating);

  try {
    // Kiểm tra xem đã tồn tại đánh giá từ người dùng này cho sản phẩm này chưa
    const existingReview = await Review.findOne({
      user_id: userId,
      product_id: productId,
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "Người dùng đã đánh giá sản phẩm này rồi.",
      });
    }

    // Tạo mới review
    const interaction = await Review.create({
      user_id: userId,
      product_id: productId,
      rating,
      comment,
      thumbnail,
      public: false,
      liked: false,
      createAt: new Date(),
      updatedAt: new Date(),
    });

    res.json({ success: true, interaction });
  } catch (error) {
    console.error("Lỗi khi tạo review:", error);
    res.status(500).json({ success: false, message: "Lỗi máy chủ." });
  }
};

// Lấy danh sách đánh giá + tổng số like
exports.getProductFeedback = async (req, res) => {
  const { productId } = req.params;

  const interactions = await Review.find({
    product_id: productId,
    public: true,
  });

  const likesCount = interactions.filter((i) => i.liked).length;
  const reviews = interactions.filter((i) => typeof i.rating === "number");

  const avgRating =
    reviews.reduce((sum, r) => sum + r.rating, 0) / (reviews.length || 1);

  // Tổng số người đánh giá
  const totalReviews = reviews.length;

  // Phân tích số người theo từng mức sao
  const ratingsBreakdown = {
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0,
  };

  reviews.forEach((r) => {
    const rounded = Math.round(r.rating);
    if (ratingsBreakdown[rounded] !== undefined) {
      ratingsBreakdown[rounded]++;
    }
  });

  res.json({
    likesCount,
    avgRating: avgRating.toFixed(1),
    totalReviews,
    ratingsBreakdown,
    interactions,
  });
};

module.exports.changePublic = async (req, res) => {
  try {
    const id = req.params.id;
    const public = req.params.public;

    await Review.updateOne({ _id: id }, { public: public });

    const review = await Review.find({ _id: id });
    res.status(200).json(review);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id; // Lấy id từ URL parameter
    const { comment, rating, thumbnail } = req.body; // Lấy comment, rating, và thumbnail từ body
    // Kiểm tra rating hợp lệ (nếu có)
    console.log(id);
    let parsedRating;
    if (rating !== undefined) {
      parsedRating = parseInt(rating, 10);
      if (isNaN(parsedRating) || parsedRating < 1 || parsedRating > 5) {
        return res
          .status(400)
          .json({ error: "Invalid rating. Rating must be between 1 and 5." });
      }
    }

    // Tạo đối tượng cập nhật
    const updateFields = {};

    if (comment !== undefined) updateFields.comment = comment;
    if (parsedRating !== undefined) updateFields.rating = parsedRating;
    if (Array.isArray(thumbnail)) {
      updateFields.thumbnail = thumbnail; // Nếu thumbnail là mảng, gán nó vào database
    }

    // Tìm và cập nhật review
    const updated = await Review.findByIdAndUpdate({ _id: id }, updateFields, {
      new: true, // Trả về document sau khi update
    });

    if (!updated) {
      return res.status(404).json({ error: "Review not found." });
    }

    // Trả về kết quả sau khi update thành công
    res.status(200).json(updated);
  } catch (error) {
    console.error("Error while updating review:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
