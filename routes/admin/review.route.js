const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/review.controller");
const multer = require("multer");
const uploadCloudinary = require("../../middlewares/admin/uploadCloud.middleware");
const upload = multer({
  limits: { fileSize: 50 * 1024 * 1024 }, // Giới hạn 50MB
});

router.get("/", controller.index);

router.get("/feedback/:productId", controller.getProductFeedback);

router.post("/like/:userId/:productId", controller.toggleLike);

router.post(
  "/:userId/:productId",
  upload.any("thumbnail", 10),
  uploadCloudinary.upload,
  controller.createOrUpdateReview
);

router.patch("/edit/:id", controller.edit);

router.patch("/change-public/:id/:public", controller.changePublic);

module.exports = router;
