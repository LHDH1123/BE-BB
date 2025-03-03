const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/account.controller");
const uploadCloudinary = require("../../middlewares/admin/uploadCloud.middleware");
const validate = require("../../validates/admin/account.validates");
const multer = require("multer");
const upload = multer({
  limits: { fileSize: 50 * 1024 * 1024 }, // Giới hạn 50MB
});

router.get("/", controller.index);

router.post(
  "/create",
  upload.single("avatar"),
  uploadCloudinary.upload,
  validate.createPost,
  controller.createPost
);

router.get("/:id", controller.edit);

router.patch(
  "/edit/:id",
  upload.single("avatar"),
  uploadCloudinary.upload,
  validate.editPatch,
  controller.editPatch
);

router.delete("/:id", controller.delete);

module.exports = router;
