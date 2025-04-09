const express = require("express");
const controller = require("../../controllers/admin/voucher.controller");
const auth = require("../../middlewares/admin/auth.middlewares"); // 👈 Import middleware
const router = express.Router();

// Danh sách voucher
router.get(
  "/",
  auth.requireAuth,
  auth.requirePermission("vouchers_view"),
  controller.index
);

// Lấy 1 voucher theo ID
router.get(
  "/:id",
  auth.requireAuth,
  auth.requirePermission("vouchers_view"),
  controller.getVoucher
);

// Tạo voucher
router.post(
  "/create",
  auth.requireAuth,
  auth.requirePermission("vouchers_create"),
  controller.createPost
);

// Chỉnh sửa voucher
router.patch(
  "/edit/:id",
  auth.requireAuth,
  auth.requirePermission("vouchers_edit"),
  controller.edit
);

// Đổi trạng thái
router.patch(
  "/change-status/:id/:status",
  auth.requireAuth,
  auth.requirePermission("vouchers_edit"),
  controller.changeStatus
);

// Xoá voucher
router.delete(
  "/delete/:id",
  auth.requireAuth,
  auth.requirePermission("vouchers_delete"),
  controller.deleteVoucher
);

module.exports = router;
