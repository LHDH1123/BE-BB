const express = require("express");
const router = express.Router();
const multer = require("multer");
const controller = require("../../controllers/client/product.controller");

router.get("/", controller.index);

router.get("/:id", controller.getProduct);

router.get("/slug/:slug", controller.getProductSlug);

router.get("/getAll/:slug", controller.getAllProductSlug);

router.get("/getAllWithName/:name", controller.getAllProductName);

module.exports = router;
