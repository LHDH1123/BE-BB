const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema(
  {
    user_id: String,
    products: [{ product_id: String }],
  },
  {
    timestamps: true,
  }
);

const Like = mongoose.model("Like", likeSchema, "likes");

module.exports = Like;
