const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema({
  name: String,
  status: Boolean,
  thumbnail: String,
});

const Brand = mongoose.model("Brand", brandSchema, "brands");

module.exports = Brand;
