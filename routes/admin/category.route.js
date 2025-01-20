const express = require("express");
const router = express.Router();
const multer = require("multer");
const uploadCloudinary = require("../../middlewares/admin/uploadCloud.middleware");
const upload = multer();
const controller = require("../../controllers/admin/category.controller");

/**
 * @swagger
 * /adminbb/categorys:
 *   get:
 *     tags:
 *       - Categories
 */
router.get("/", controller.index);

module.exports = router;
