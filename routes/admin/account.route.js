const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/account.controller");
const uploadCloudinary = require("../../middlewares/admin/uploadCloud.middleware");
const validate = require("../../validates/admin/account.validates");
const multer = require("multer");
const auth = require("../../middlewares/admin/auth.middlewares"); // <-- Thêm middleware auth

const upload = multer({
  limits: { fileSize: 50 * 1024 * 1024 }, // Giới hạn 50MB
});

// 👇 Route list with permissions
router.get(
  "/",
  auth.requireAuth,
  auth.requirePermission("accounts_view"),
  controller.index
);

router.post(
  "/create",
  auth.requireAuth,
  auth.requirePermission("accounts_create"),
  upload.any("thumbnail"),
  uploadCloudinary.upload,
  validate.createPost,
  controller.createPost
);

router.get(
  "/:id",
  auth.requireAuth,
  auth.requirePermission("accounts_view"),
  controller.getAccount
);

router.patch(
  "/edit/:id",
  auth.requireAuth,
  auth.requirePermission("accounts_edit"),
  upload.any("thumbnail"),
  uploadCloudinary.upload,
  // validate.editPatch,
  controller.editPatch
);

router.delete(
  "/:id",
  auth.requireAuth,
  auth.requirePermission("accounts_delete"),
  controller.delete
);

router.patch(
  "/change-status/:id/:status",
  auth.requireAuth,
  auth.requirePermission("accounts_edit"),
  controller.changeStatus
);

router.patch(
  "/change-multi",
  auth.requireAuth,
  auth.requirePermission("accounts_edit"),
  controller.changeMultiPatch
);

module.exports = router;
