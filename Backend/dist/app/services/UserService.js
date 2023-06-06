"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const User_1 = require("../models/User");
const DatabaseProvider_1 = require("../../database/DatabaseProvider");
const MailService_1 = require("./MailService");
const Permission_1 = require("../models/Permission");
const PermissionAssignment_1 = require("../models/PermissionAssignment");
const validator_1 = __importDefault(require("validator"));
const EntityRegistry_1 = require("../../database/EntityRegistry");
class UserService {
    static hasPermission(user_id, permission_identifier, write) {
        return __awaiter(this, void 0, void 0, function* () {
            if (yield this.isAdmin(user_id)) {
                return true;
            }
            const permissionRepo = DatabaseProvider_1.AppDataSource.getRepository(Permission_1.Permission);
            const permissionAssignmentsRepo = DatabaseProvider_1.AppDataSource.getRepository(PermissionAssignment_1.PermissionAssignment);
            const user = yield this.getUserById(user_id);
            const permission = yield permissionRepo.findOneBy({
                identifier: permission_identifier
            });
            if (permission == null || user == null) {
                return false;
            }
            let assignment = yield permissionAssignmentsRepo.findOneBy({
                permission_id: permission.id,
                user_id: user.id
            });
            if (assignment == null) {
                assignment = yield permissionAssignmentsRepo.findOneBy({
                    permission_id: permission.id,
                    group_id: user.group.id
                });
            }
            if (assignment == null) {
                return false;
            }
            if (write && assignment.writeable) {
                return true;
            }
            else if (!write) {
                return true;
            }
            return false;
        });
    }
    static getPermissions() {
        return __awaiter(this, void 0, void 0, function* () {
            const permissionRepo = DatabaseProvider_1.AppDataSource.getRepository(Permission_1.Permission);
            return yield permissionRepo.find();
        });
    }
    static getPermissionAssignmentsByUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const permissionAssignmentsRepo = DatabaseProvider_1.AppDataSource.getRepository(PermissionAssignment_1.PermissionAssignment);
            return yield permissionAssignmentsRepo.findBy({
                user_id: user.id
            });
        });
    }
    static getPermissionAssignmentsByGroup(group) {
        return __awaiter(this, void 0, void 0, function* () {
            const permissionAssignmentsRepo = DatabaseProvider_1.AppDataSource.getRepository(PermissionAssignment_1.PermissionAssignment);
            return yield permissionAssignmentsRepo.findBy({
                group_id: group.id
            });
        });
    }
    static isAdmin(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const permissionRepo = DatabaseProvider_1.AppDataSource.getRepository(Permission_1.Permission);
            const permissionAssignmentsRepo = DatabaseProvider_1.AppDataSource.getRepository(PermissionAssignment_1.PermissionAssignment);
            const user = yield this.getUserById(user_id);
            const permission = yield permissionRepo.findOneBy({
                identifier: '*'
            });
            if (permission == null || user == null) {
                return false;
            }
            let assignment = yield permissionAssignmentsRepo.findOneBy({
                permission_id: permission.id,
                user_id: user.id
            });
            if (assignment == null) {
                assignment = yield permissionAssignmentsRepo.findOneBy({
                    permission_id: permission.id,
                    group_id: user.group.id
                });
            }
            if (assignment != null) {
                return true;
            }
            return false;
        });
    }
    static checkAndChangeData(value, ormAtr, user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const userRepo = DatabaseProvider_1.AppDataSource.getRepository(User_1.User);
            const user = yield userRepo.findOneBy({
                id: user_id
            });
            if (value != null) {
                switch (ormAtr) {
                    case 'firstname':
                        if (typeof (value) != 'string' || !validator_1.default.isAlpha(value)) {
                            return false;
                        }
                        user.firstname = value;
                        break;
                    case 'lastname':
                        if (typeof (value) != 'string' || !validator_1.default.isAlpha(value)) {
                            return false;
                        }
                        user.lastname = value;
                        break;
                    case 'birthday':
                        if (!(value instanceof Date) || !validator_1.default.isDate(value.toString())) {
                            return false;
                        }
                        user.birthday = value;
                        break;
                    case 'phone':
                        if ((typeof (value) != 'string') || !validator_1.default.isMobilePhone(value)) {
                            return false;
                        }
                        user.phone = value;
                        break;
                    case 'street':
                        if (typeof (value) != 'string' || !validator_1.default.isAlpha(value)) {
                            return false;
                        }
                        user.street = value;
                        break;
                    case 'houseNr':
                        if (typeof (value) != 'string' || !validator_1.default.isAlpha(value)) {
                            return false;
                        }
                        user.houseNr = value;
                        break;
                    case 'zip':
                        if (typeof (value) != 'number' || !validator_1.default.isAlpha(value.toString())) {
                            return false;
                        }
                        user.zip = value;
                        break;
                    case 'city':
                        if (typeof (value) != 'string' || !validator_1.default.isAlpha(value)) {
                            return false;
                        }
                        user.city = value;
                        break;
                    case 'country':
                        if (typeof (value) != 'string' || !validator_1.default.isAlpha(value)) {
                            return false;
                        }
                        user.country = value;
                        break;
                    case 'nationality':
                        if (typeof (value) != 'string' || !validator_1.default.isAlpha(value)) {
                            return false;
                        }
                        user.nationality = value;
                        break;
                    case 'username':
                        if (typeof (value) != 'string' || !validator_1.default.isAlpha(value)) {
                            return false;
                        }
                        user.username = value;
                        break;
                    case 'email':
                        if (typeof (value) != 'string' || !validator_1.default.isEmail(value)) {
                            return false;
                        }
                        user.email = value;
                        break;
                    case 'isActive':
                        if (typeof (value) != 'string' || !validator_1.default.isBoolean(value.toString())) {
                            return false;
                        }
                        user.isActive = value.toString().toLowerCase() === 'true';
                        break;
                    case 'otpActive':
                        if (typeof (value) != 'string' || !validator_1.default.isBoolean(value.toString())) {
                            return false;
                        }
                        user.otpActive = value.toString().toLowerCase() === 'true';
                        break;
                    case 'verified':
                        if (typeof (value) != 'string' || !validator_1.default.isBoolean(value.toString())) {
                            return false;
                        }
                        user.verified = value.toString().toLowerCase() === 'true';
                        break;
                }
                yield userRepo.save(user);
                return true;
            }
            return false;
        });
    }
    static sendVerificationMail(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const message = `Hallo ${user.username},\n\n
vielen Dank für deine Registrierung auf unserer Webseite!\n
Um deinen Account zu aktivieren, senden wir dir in dieser E-Mail einen Bestätigungscode zu.\n
\n
Dein Bestätigungscode: ${user.verifyCode}\n
\n\n
Mit freundlichen Grüßen\n
StepOne e.V.`;
            const mail = new MailService_1.MailService(user.email, 'Deine Registrierung', message);
            return yield mail.send();
        });
    }
    static usernameAlreadyExists(username) {
        return __awaiter(this, void 0, void 0, function* () {
            const userRepo = DatabaseProvider_1.AppDataSource.getRepository(User_1.User);
            return (yield userRepo.countBy({ username })) > 0;
        });
    }
    static mailAlreadyExists(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const userRepo = DatabaseProvider_1.AppDataSource.getRepository(User_1.User);
            return (yield userRepo.countBy({ email })) > 0;
        });
    }
    static getUserById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield EntityRegistry_1.EntityRegistry.getInstance().User.findOne({
                relations: {
                    group: true
                },
                where: {
                    id: userId
                }
            });
        });
    }
}
exports.UserService = UserService;
//# sourceMappingURL=UserService.js.map