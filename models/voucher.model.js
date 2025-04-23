const mongoose = require("mongoose");

const voucherSchema = new mongoose.Schema(
  {
    title: String,
    status: Boolean,
    discount: Number,
    min_order_total: Number,
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

const Voucher = mongoose.model("Voucher", voucherSchema, "vouchers");

module.exports = Voucher;
