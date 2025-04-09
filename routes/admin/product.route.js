const express = require("express");
const router = express.Router();
const multer = require("multer");
const uploadCloudinary = require("../../middlewares/admin/uploadCloud.middleware");
const upload = multer({
  limits: { fileSize: 50 * 1024 * 1024 }, // Giới hạn 50MB
});
const controller = require("../../controllers/admin/product.controller");
const {
  requireAuth,
  requirePermission,
} = require("../../middlewares/admin/auth.middlewares");

router.get(
  "/",
  requireAuth,
  requirePermission("products_view"),
  controller.index
);

router.get(
  "/:id",
  requireAuth,
  requirePermission("products_view"),
  controller.getProduct
);

router.get(
  "/slug/:slug",
  requireAuth,
  requirePermission("products_view"),
  controller.getProductSlug
);

router.post(
  "/create",
  requireAuth,
  requirePermission("products_create"),
  upload.any("thumbnail", 10),
  uploadCloudinary.upload,
  controller.createPost
);

router.patch(
  "/change-status/:id/:status",
  requireAuth,
  requirePermission("products_edit"),
  controller.changeStatus
);

router.patch(
  "/change-multi",
  requireAuth,
  requirePermission("products_edit"),
  controller.changeMultiPatch
);

router.patch(
  "/edit/:id",
  requireAuth,
  requirePermission("products_edit"),
  upload.any("thumbnail", 10),
  uploadCloudinary.upload,
  controller.editPatch
);

router.delete(
  "/delete/:id",
  requireAuth,
  requirePermission("products_delete"),
  controller.deleteProduct
);

module.exports = router;
