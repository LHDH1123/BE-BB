const express = require("express");
const controller = require("../../controllers/client/user.controller");
const router = express.Router();
const validate = require("../../validates/client/user.vadidate");

router.get("/", controller.getAllUser);

router.get("/logout", controller.logout);

router.get("/:id", controller.getUser);

router.patch("/edit/:id", controller.editUser);

router.post("/register", validate.registerPost, controller.registerPost);

router.post("/login", validate.loginPost, controller.loginPost);

router.post(
  "/password/forgot",
  validate.forgotPasswordPost,
  controller.forgotPasswordPost
);

router.post("/password/otp", controller.otpPasswordPost);

router.post("/password/reset", controller.resetPasswordPost);

router.post("/refresh-token", controller.refreshToken);

module.exports = router;
