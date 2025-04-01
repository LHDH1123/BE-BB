const express = require("express");
const controller = require("../../controllers/client/order.controller");
const router = express.Router();

router.get("/", controller.index);

router.get("/:userId", controller.getOrderUser);

module.exports = router;
