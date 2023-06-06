"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const AuthMiddleware_1 = __importDefault(require("../app/middlewares/AuthMiddleware"));
const AuthOTPMiddleware_1 = __importDefault(require("../app/middlewares/AuthOTPMiddleware"));
const ControllerRegistry_1 = require("../app/controllers/ControllerRegistry");
const router = express_1.default.Router();
router.post("/login", ControllerRegistry_1.ControllerRegistry.Auth.PostLogin);
router.post("/logout", AuthMiddleware_1.default, ControllerRegistry_1.ControllerRegistry.Auth.PostLogout);
router.post("/register", ControllerRegistry_1.ControllerRegistry.Auth.PostRegister);
router.post("/register/confirm", ControllerRegistry_1.ControllerRegistry.Auth.PostRegisterConfirm);
router.post("/otp/enable", AuthMiddleware_1.default, ControllerRegistry_1.ControllerRegistry.Auth.PostEnableOTP);
router.post("/otp/disable", AuthMiddleware_1.default, ControllerRegistry_1.ControllerRegistry.Auth.PostDisableOTP);
router.post("/otp", AuthOTPMiddleware_1.default, ControllerRegistry_1.ControllerRegistry.Auth.PostOTP);
router.post("/password/reset-request", ControllerRegistry_1.ControllerRegistry.Auth.PostResetPasswordRequest);
router.post("/password/reset", ControllerRegistry_1.ControllerRegistry.Auth.PostPasswordReset);
router.get("/user", AuthMiddleware_1.default, ControllerRegistry_1.ControllerRegistry.User.GetUser);
router.get("/session", AuthMiddleware_1.default, ControllerRegistry_1.ControllerRegistry.User.GetSession);
exports.default = router;
//# sourceMappingURL=AuthRouter.js.map