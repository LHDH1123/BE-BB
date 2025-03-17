const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/store.controller");

router.get("/", controller.index);

router.get("/:id", controller.getStore);

router.post("/create", controller.createPost);

router.patch("/edit/:id", controller.editPatch);

router.delete("/delete/:id", controller.delete);

router.patch("/change-status/:id/:status", controller.changeStatus);

router.patch("/change-multi", controller.changeMultiPatch);

module.exports = router;
