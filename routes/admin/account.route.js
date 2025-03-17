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
  upload.any("thumbnail"),
  uploadCloudinary.upload,
  validate.createPost,
  controller.createPost
);

router.get("/:id", controller.edit);

router.patch(
  "/edit/:id",
  upload.any("thumbnail"),
  uploadCloudinary.upload,
  // validate.editPatch,
  controller.editPatch
);

router.delete("/:id", controller.delete);

router.patch("/change-status/:id/:status", controller.changeStatus);

router.patch("/change-multi", controller.changeMultiPatch);

module.exports = router;
