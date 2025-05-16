const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/role.controller");
const auth = require("../../middlewares/admin/auth.middlewares"); // 👈 Import middleware

// Lấy danh sách role
router.get("/", controller.index);

// Lấy role theo ID
router.get("/:id", controller.getRole);

// Tạo mới role
router.post(
  "/create",
  auth.requireAuth,
  auth.requirePermission("roles_create"),
  controller.createPost
);

// Chỉnh sửa permission
router.patch(
  "/editPermission/:id",
  auth.requireAuth,
  auth.requirePermission("roles_edit"),
  controller.editPatch
);

// Chỉnh sửa thông tin role
router.patch(
  "/edit/:id",
  auth.requireAuth,
  auth.requirePermission("roles_edit"),
  controller.editPatchData
);

// Xoá role
router.delete(
  "/delete/:id",
  auth.requireAuth,
  auth.requirePermission("roles_delete"),
  controller.delete
);

// Đổi trạng thái role
router.patch(
  "/change-status/:id/:status",
  auth.requireAuth,
  auth.requirePermission("roles_edit"),
  controller.changeStatus
);

module.exports = router;
