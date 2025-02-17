const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema({
  name: String,
  status: Boolean,
  thumbnail: String,
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
  deletedAt: Date,
});

const Brand = mongoose.model("Brand", brandSchema, "brands");

module.exports = Brand;
