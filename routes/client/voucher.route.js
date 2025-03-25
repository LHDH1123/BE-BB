const express = require("express");
const controller = require("../../controllers/client/voucher.controller");
const router = express.Router();

router.get("/", controller.index);

router.get("/:id", controller.getVoucher);

router.post("/create", controller.createPost);

router.patch("/edit/:id", controller.edit);

router.patch("/change-status/:id/:status", controller.changeStatus);

router.delete("/delete/:id", controller.deleteVoucher);

module.exports = router;
