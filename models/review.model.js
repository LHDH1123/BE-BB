const mongoose = require("mongoose");
const reviewSchema = new mongoose.Schema(
  {
    user_id: String,
    product_id: String,
    liked: Boolean,
    thumbnail: {
      type: [String], // Mảng chứa đường dẫn hình ảnh
      default: [],
    },
    rating: { type: Number, min: 1, max: 5 },
    comment: { type: String },
    public: Boolean,
    createAt: {
      type: Date,
      default: Date.now,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Review = mongoose.model("Review", reviewSchema, "reviews");

module.exports = Review;
