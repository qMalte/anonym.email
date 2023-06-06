import express from "express";
import AuthMiddleware from "../app/middlewares/AuthMiddleware";
import AuthOTPMiddleware from "../app/middlewares/AuthOTPMiddleware";
import {ControllerRegistry} from "../app/controllers/ControllerRegistry";

const router = express.Router();

router.post("/login", ControllerRegistry.Auth.PostLogin);
router.post("/logout", AuthMiddleware, ControllerRegistry.Auth.PostLogout);
router.post("/register", ControllerRegistry.Auth.PostRegister);
router.post("/register/confirm", ControllerRegistry.Auth.PostRegisterConfirm);

router.post("/otp/enable", AuthMiddleware, ControllerRegistry.Auth.PostEnableOTP);
router.post("/otp/disable", AuthMiddleware, ControllerRegistry.Auth.PostDisableOTP);
router.post("/otp", AuthOTPMiddleware, ControllerRegistry.Auth.PostOTP);

router.post("/password/reset-request", ControllerRegistry.Auth.PostResetPasswordRequest);
router.post("/password/reset", ControllerRegistry.Auth.PostPasswordReset);

router.get("/user", AuthMiddleware, ControllerRegistry.User.GetUser);
router.get("/session", AuthMiddleware, ControllerRegistry.User.GetSession);

export default router;
