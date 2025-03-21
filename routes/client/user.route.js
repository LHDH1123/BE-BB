const express = require("express");
const controller = require("../../controllers/client/user.controller");
const router = express.Router();
const validate = require("../../validates/client/user.vadidate");

router.post("/register", validate.registerPost, controller.registerPost);

router.post("/login", validate.loginPost, controller.loginPost);

router.get("/logout", controller.logout);

router.post(
  "/password/forgot",
  validate.forgotPasswordPost,
  controller.forgotPasswordPost
);

router.post("/password/otp", controller.otpPasswordPost);

router.post("/password/reset", controller.resetPasswordPost);

module.exports = router;
