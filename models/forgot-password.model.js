const mongoose = require("mongoose");

const forgotPasswordSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    otp: { type: String, required: true },
    expireAt: { type: Date, required: true },
  },
  {
    timestamps: true,
  }
);

// Tự động xóa OTP sau 3 phút
forgotPasswordSchema.index({ expireAt: 1 }, { expireAfterSeconds: 180 });

const ForgotPassword = mongoose.model(
  "ForgotPassword",
  forgotPasswordSchema,
  "forgot-password"
);
module.exports = ForgotPassword;
