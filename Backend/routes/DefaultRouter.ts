import express from "express";
import AuthMiddleware from "../app/middlewares/AuthMiddleware";
import {ControllerRegistry} from "../app/controllers/ControllerRegistry";
import {SystemResources} from "../resources/SystemResources";
import BetaMiddleware from "../app/middlewares/BetaMiddleware";

const router = express.Router();

router.get("/test", (req: express.Request, res: express.Response) => {
    res.send(SystemResources.Hello);
});

// General
router.get('/publicKey', ControllerRegistry.Encryption.GetPublicKey);
router.get('/beta', ControllerRegistry.Test.getBetaStatus);
router.get('/beta/test', BetaMiddleware, ControllerRegistry.Test.getBetaStatus);

// Permission-Management
router.get("/permissions", AuthMiddleware, ControllerRegistry.Permission.GetPermissions);
router.get("/permissions/group/:group_id", AuthMiddleware, ControllerRegistry.Permission.GetPermissionsByGroup);
router.get("/permissions/user/:user_id", AuthMiddleware, ControllerRegistry.Permission.GetPermissionsByUser);
router.post("/permissions/group", AuthMiddleware, ControllerRegistry.Permission.PostPermissionGroup);
router.post("/permissions/user", AuthMiddleware, ControllerRegistry.Permission.PostPermissionUser);
router.delete("/permission/assignment/:assignment_id", AuthMiddleware, ControllerRegistry.Permission.DeletePermissionAssignment);

router.put("/password", AuthMiddleware, ControllerRegistry.User.PutChangePassword);
router.put("/email", AuthMiddleware, ControllerRegistry.User.PutChangeMail);
router.post("/email", AuthMiddleware, ControllerRegistry.User.PostChangeMail);
router.put("/userdata", AuthMiddleware, ControllerRegistry.User.PutUser);
router.put("/username", AuthMiddleware, ControllerRegistry.User.PutUsername);
router.get("/user/permissions", AuthMiddleware, ControllerRegistry.User.GetPermissions);

// User-Management
router.get("/users", AuthMiddleware, ControllerRegistry.User.GetUsers);
router.put("/user", AuthMiddleware, ControllerRegistry.User.PutManageUser);

// Group-Management
router.get("/group/:group_id", AuthMiddleware, ControllerRegistry.Group.GetGroup);
router.get("/groups", AuthMiddleware, ControllerRegistry.Group.GetGroups);
router.post("/group", AuthMiddleware, ControllerRegistry.Group.PostGroup);
router.put("/group", AuthMiddleware, ControllerRegistry.Group.PutGroup);
router.delete("/group/:group_id", AuthMiddleware, ControllerRegistry.Group.DelGroup);
router.put("/group/user", AuthMiddleware, ControllerRegistry.Group.PutSetUser);

// MailAlias Management
router.post("/alias", BetaMiddleware, ControllerRegistry.MailAlias.PostMailAlias);
router.delete("/alias/:id/admin", AuthMiddleware, ControllerRegistry.MailAlias.DeleteAlias);
router.delete("/alias/:id", AuthMiddleware, ControllerRegistry.MailAlias.DeleteOwnAlias);
router.get("/aliases", AuthMiddleware, ControllerRegistry.MailAlias.GetOwnAliases);
router.get("/aliases/admin", AuthMiddleware, ControllerRegistry.MailAlias.GetAliases);
router.put("/alias", AuthMiddleware, ControllerRegistry.MailAlias.PutCustomNameOfAlias);

export default router;
