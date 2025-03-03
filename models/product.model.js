const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");
mongoose.plugin(slug);

const productSchema = new mongoose.Schema(
  {
    title: String,
    category_id: String,
    brand_id: String,
    description: String,
    price: Number,
    discountPercentage: Number,
    stock: Number,
    thumbnail: {
      type: [String], // Mảng chứa đường dẫn hình ảnh
      default: [],
    },
    status: Boolean,
    position: Number,
    SKU: String,
    slug: {
      type: String,
      slug: "title",
      unique: true,
    },
    createdBy: {
      //   account_id: String,
      createAt: {
        type: Date,
        default: Date.now,
      },
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    // deletedAt: Date,
    deletedBy: {
      //   account_id: String,
      deletedAt: Date,
    },
    updatedBy: [
      {
        // account_id: String,
        updatedAt: Date,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema, "products");

module.exports = Product;
