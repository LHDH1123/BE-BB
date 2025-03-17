const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema(
  {
    title: String,
    linkHref: String,
    thumbnail: String,
    description: String,
    status: String,
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: Date,
  },
  {
    timestamps: true,
  }
);
