const mongoose = require("mongoose");

const storeSchema = new mongoose.Schema(
  {
    name: String,
    local: String,
    city: String,
    phone: String,
    timeOpen: String,
    status: Boolean,
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

const Store = mongoose.model("Store", storeSchema, "stores");

module.exports = Store;
