const express = require("express");
const router = express.Router();
const multer = require("multer");
const uploadCloudinary = require("../../middlewares/admin/uploadCloud.middleware");
const auth = require("../../middlewares/admin/auth.middlewares"); // 👈 Thêm dòng này

const upload = multer({
  limits: { fileSize: 50 * 1024 * 1024 }, // Giới hạn 50MB
});

const controller = require("../../controllers/admin/brand.controller");

// Danh sách brand
router.get(
  "/",
  auth.requireAuth,
  auth.requirePermission("brands_view"),
  controller.index
);

// Lấy brand theo ID
router.get(
  "/:id",
  auth.requireAuth,
  auth.requirePermission("brands_view"),
  controller.getBrand
);

// Lấy brand theo name
router.get(
  "/name/:name",
  auth.requireAuth,
  auth.requirePermission("brands_view"),
  controller.getBrandName
);

// Tạo brand mới
router.post(
  "/create",
  auth.requireAuth,
  auth.requirePermission("brands_create"),
  upload.any("thumbnail"),
  uploadCloudinary.upload,
  controller.createPost
);

// Thay đổi trạng thái
router.patch(
  "/change-status/:id/:status",
  auth.requireAuth,
  auth.requirePermission("brands_edit"),
  controller.changeStatus
);

// Cập nhật nhiều brand
router.patch(
  "/change-multi",
  auth.requireAuth,
  auth.requirePermission("brands_edit"),
  controller.changeMultiPatch
);

// Chỉnh sửa brand
router.patch(
  "/edit/:id",
  auth.requireAuth,
  auth.requirePermission("brands_edit"),
  upload.any("thumbnail"),
  uploadCloudinary.upload,
  controller.editPatch
);

// Xoá brand
router.delete(
  "/delete/:id",
  auth.requireAuth,
  auth.requirePermission("brands_delete"),
  controller.deleteBrand
);

module.exports = router;
