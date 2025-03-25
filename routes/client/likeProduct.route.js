const express = require("express");
const controller = require("../../controllers/client/likeProduct.controller");
const router = express.Router();

router.get("/:userId", controller.index);

router.post("/add/:userId", controller.addPost);

router.delete("/delete/:userId/:productId", controller.delete);

router.delete("/delete/:userId", controller.deleteLike);

module.exports = router;
