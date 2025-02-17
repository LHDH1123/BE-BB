const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/role.controller");

router.get("/", controller.index);

router.get("/:id", controller.getRole);

router.post("/create", controller.createPost);

router.patch("/edit/:id", controller.editPatch);

router.delete("/delete/:id", controller.delete);

// router.patch("/permissions", controller.permissionsPatch);

module.exports = router;
