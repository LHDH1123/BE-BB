const express = require("express");
const router = express.Router();
const multer = require("multer");
const uploadCloudinary = require("../../middlewares/admin/uploadCloud.middleware");
const auth = require("../../middlewares/admin/auth.middlewares"); // 👈 Thêm dòng này

const upload = multer({
  limits: { fileSize: 50 * 1024 * 1024 }, // Giới hạn 50MB
});

const controller = require("../../controllers/admin/category.controller");

// Lấy danh sách category
router.get(
  "/",
  auth.requireAuth,
  auth.requirePermission("products-category_view"),
  controller.index
);

// Lấy category theo ID
router.get(
  "/:id",
  auth.requireAuth,
  auth.requirePermission("products-category_view"),
  controller.getCategory
);

// Lấy category theo slug
router.get(
  "/slug/:slug",
  auth.requireAuth,
  auth.requirePermission("products-category_view"),
  controller.getCategorySlug
);

// Tạo category mới
router.post(
  "/create",
  auth.requireAuth,
  auth.requirePermission("products-category_create"),
  upload.single("thumbnail"),
  uploadCloudinary.upload,
  controller.createPost
);

// Chỉnh sửa category
router.patch(
  "/edit/:id",
  auth.requireAuth,
  auth.requirePermission("products-category_edit"),
  controller.edit
);

// Thay đổi trạng thái
router.patch(
  "/change-status/:id/:status",
  auth.requireAuth,
  auth.requirePermission("products-category_edit"),
  controller.changeStatus
);

// Chỉnh sửa nhiều
router.patch(
  "/change-multi",
  auth.requireAuth,
  auth.requirePermission("products-category_edit"),
  controller.changeMultiPatch
);

// Xoá category
router.delete(
  "/delete/:id",
  auth.requireAuth,
  auth.requirePermission("products-category_delete"),
  controller.deleteCategory
);

module.exports = router;
