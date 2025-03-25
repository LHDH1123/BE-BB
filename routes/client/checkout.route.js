const express = require("express");
const controller = require("../../controllers/client/checkout.controller");
const router = express.Router();

router.get("/:userId", controller.index);

router.post("/oder/:userId", controller.checkoutPost);

router.get("/success/:orderId", controller.success);

module.exports = router;
