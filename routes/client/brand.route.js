const express = require("express");
const router = express.Router();
const multer = require("multer");
const controller = require("../../controllers/client/brand.controller");

// Danh sách brand
router.get("/", controller.index);

// Lấy brand theo ID
router.get("/:id", controller.getBrand);

// Lấy brand theo name
router.get("/name/:name", controller.getBrandName);

module.exports = router;
