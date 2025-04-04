const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/role.controller");

router.get("/", controller.index);

router.get("/:id", controller.getRole);

router.post("/create", controller.createPost);

router.patch("/editPermission/:id", controller.editPatch);

router.patch("/edit/:id", controller.editPatchData);

router.delete("/delete/:id", controller.delete);

router.patch("/change-status/:id/:status", controller.changeStatus);

module.exports = router;
