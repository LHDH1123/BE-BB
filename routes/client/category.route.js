const express = require("express");
const router = express.Router();
const multer = require("multer");

const controller = require("../../controllers/client/category.controller");

// Lấy danh sách category
router.get("/", controller.index);

// Lấy category theo ID
router.get("/:id", controller.getCategory);

// Lấy category theo slug
router.get("/slug/:slug", controller.getCategorySlug);

module.exports = router;
