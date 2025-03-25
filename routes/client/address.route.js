const express = require("express");
const controller = require("../../controllers/client/address.controller");
const router = express.Router();

router.get("/:userId", controller.index);

router.get("/getAddress/:addressId", controller.getAddress);

router.post("/add/:userId", controller.addPost);

router.patch("/edit/:addressId", controller.editAddress);

router.delete("/delete/:addressId", controller.deleteAddress);

module.exports = router;
