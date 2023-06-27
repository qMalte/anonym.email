"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const AuthMiddleware_1 = __importDefault(require("../app/middlewares/AuthMiddleware"));
const ControllerRegistry_1 = require("../app/controllers/ControllerRegistry");
const SystemResources_1 = require("../resources/SystemResources");
const BetaMiddleware_1 = __importDefault(require("../app/middlewares/BetaMiddleware"));
const router = express_1.default.Router();
router.get("/test", (req, res) => {
    res.send(SystemResources_1.SystemResources.Hello);
});
// General
router.get('/publicKey', ControllerRegistry_1.ControllerRegistry.Encryption.GetPublicKey);
router.get('/beta', ControllerRegistry_1.ControllerRegistry.Test.getBetaStatus);
router.get('/beta/test', BetaMiddleware_1.default, ControllerRegistry_1.ControllerRegistry.Test.getBetaStatus);
// Permission-Management
router.get("/permissions", AuthMiddleware_1.default, ControllerRegistry_1.ControllerRegistry.Permission.GetPermissions);
router.get("/permissions/group/:group_id", AuthMiddleware_1.default, ControllerRegistry_1.ControllerRegistry.Permission.GetPermissionsByGroup);
router.get("/permissions/user/:user_id", AuthMiddleware_1.default, ControllerRegistry_1.ControllerRegistry.Permission.GetPermissionsByUser);
router.post("/permissions/group", AuthMiddleware_1.default, ControllerRegistry_1.ControllerRegistry.Permission.PostPermissionGroup);
router.post("/permissions/user", AuthMiddleware_1.default, ControllerRegistry_1.ControllerRegistry.Permission.PostPermissionUser);
router.delete("/permission/assignment/:assignment_id", AuthMiddleware_1.default, ControllerRegistry_1.ControllerRegistry.Permission.DeletePermissionAssignment);
router.put("/password", AuthMiddleware_1.default, ControllerRegistry_1.ControllerRegistry.User.PutChangePassword);
router.put("/email", AuthMiddleware_1.default, ControllerRegistry_1.ControllerRegistry.User.PutChangeMail);
router.post("/email", AuthMiddleware_1.default, ControllerRegistry_1.ControllerRegistry.User.PostChangeMail);
router.put("/userdata", AuthMiddleware_1.default, ControllerRegistry_1.ControllerRegistry.User.PutUser);
router.put("/username", AuthMiddleware_1.default, ControllerRegistry_1.ControllerRegistry.User.PutUsername);
router.get("/user/permissions", AuthMiddleware_1.default, ControllerRegistry_1.ControllerRegistry.User.GetPermissions);
// User-Management
router.get("/users", AuthMiddleware_1.default, ControllerRegistry_1.ControllerRegistry.User.GetUsers);
router.put("/user", AuthMiddleware_1.default, ControllerRegistry_1.ControllerRegistry.User.PutManageUser);
// Group-Management
router.get("/group/:group_id", AuthMiddleware_1.default, ControllerRegistry_1.ControllerRegistry.Group.GetGroup);
router.get("/groups", AuthMiddleware_1.default, ControllerRegistry_1.ControllerRegistry.Group.GetGroups);
router.post("/group", AuthMiddleware_1.default, ControllerRegistry_1.ControllerRegistry.Group.PostGroup);
router.put("/group", AuthMiddleware_1.default, ControllerRegistry_1.ControllerRegistry.Group.PutGroup);
router.delete("/group/:group_id", AuthMiddleware_1.default, ControllerRegistry_1.ControllerRegistry.Group.DelGroup);
router.put("/group/user", AuthMiddleware_1.default, ControllerRegistry_1.ControllerRegistry.Group.PutSetUser);
// MailAlias Management
router.post("/alias", BetaMiddleware_1.default, ControllerRegistry_1.ControllerRegistry.MailAlias.PostMailAlias);
router.delete("/alias/:id/admin", AuthMiddleware_1.default, ControllerRegistry_1.ControllerRegistry.MailAlias.DeleteAlias);
router.delete("/alias/:id", AuthMiddleware_1.default, ControllerRegistry_1.ControllerRegistry.MailAlias.DeleteOwnAlias);
router.get("/aliases", AuthMiddleware_1.default, ControllerRegistry_1.ControllerRegistry.MailAlias.GetOwnAliases);
router.get("/aliases/admin", AuthMiddleware_1.default, ControllerRegistry_1.ControllerRegistry.MailAlias.GetAliases);
router.put("/alias", AuthMiddleware_1.default, ControllerRegistry_1.ControllerRegistry.MailAlias.PutCustomNameOfAlias);
exports.default = router;
//# sourceMappingURL=DefaultRouter.js.map