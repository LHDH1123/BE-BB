const express = require("express");
const router = express.Router();
const multer = require("multer");
const uploadCloudinary = require("../../middlewares/admin/uploadCloud.middleware");
const upload = multer();
const controller = require("../../controllers/admin/brand.controller");

router.get("/", controller.index);

router.post(
  "/create",
  upload.single("thumbnail"), // Nhận file từ form-data
  uploadCloudinary.upload, // Middleware upload ảnh
  controller.createPost // Xử lý tạo brand
);
router.patch("/change-status/:id/:status", controller.changeStatus);

router.patch("/change-multi", controller.changeMultiPatch);

router.patch("/edit/:id", controller.editPatch);

router.delete("/delete/:id", controller.deleteBrand);

module.exports = router;
