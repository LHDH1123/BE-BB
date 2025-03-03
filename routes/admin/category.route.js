const express = require("express");
const router = express.Router();
const multer = require("multer");
const uploadCloudinary = require("../../middlewares/admin/uploadCloud.middleware");
const upload = multer({
  limits: { fileSize: 50 * 1024 * 1024 }, // Giới hạn 50MB
});
const controller = require("../../controllers/admin/category.controller");

router.get("/", controller.index);

router.get("/:id", controller.getCategory);

router.post(
  "/create",
  upload.single("thumbnail"),
  uploadCloudinary.upload,
  controller.createPost
);

router.patch("/edit/:id", controller.edit);

router.patch("/change-status/:id/:status", controller.changeStatus);

router.patch("/change-multi", controller.changeMultiPatch);

router.delete("/delete/:id", controller.deleteCategory);

module.exports = router;
