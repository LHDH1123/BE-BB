const express = require("express");
const controller = require("../../controllers/client/cart.controller");
const router = express.Router();

router.get("/:userId", controller.index);

router.post("/add/:userId", controller.addPost);

router.delete("/delete/:userId/:productId", controller.delete);

router.patch("/update/:userId/:productId/:quantity", controller.updateQuantity);

module.exports = router;
