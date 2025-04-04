const express = require("express");
const router = express.Router();
const multer = require("multer");
const uploadCloudinary = require("../../middlewares/admin/uploadCloud.middleware");
const upload = multer({
  limits: { fileSize: 50 * 1024 * 1024 }, // Giới hạn 50MB
});
const controller = require("../../controllers/admin/product.controller");

router.get("/", controller.index);

router.get("/:id", controller.getProduct);

router.get("/slug/:slug", controller.getProductSlug);

router.post(
  "/create",
  upload.any("thumbnail", 10),
  uploadCloudinary.upload,
  controller.createPost
);

router.patch("/change-status/:id/:status", controller.changeStatus);

router.patch("/change-multi", controller.changeMultiPatch);

router.patch(
  "/edit/:id",
  upload.any("thumbnail", 10),
  uploadCloudinary.upload,
  controller.editPatch
);

router.delete("/delete/:id", controller.deleteProduct);

module.exports = router;
