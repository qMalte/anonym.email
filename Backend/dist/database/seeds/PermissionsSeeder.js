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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionsSeeder = void 0;
const DatabaseProvider_1 = require("../DatabaseProvider");
const Permission_1 = require("../../app/models/Permission");
class PermissionsSeeder {
    constructor() {
        this.permissionRepo = DatabaseProvider_1.AppDataSource.getRepository(Permission_1.Permission);
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.createPermission('*', 'Administrator (All Privileges)');
            // Permission / User / Group - Management
            yield this.createPermission('permissions', 'Rechteverwaltung');
            yield this.createPermission('users', 'Benutzerverwaltung');
            yield this.createPermission('groups', 'Gruppenverwaltung');
            yield this.createPermission('aliases', 'Alias Verwaltung');
        });
    }
    createPermission(identifier, description) {
        return __awaiter(this, void 0, void 0, function* () {
            if ((yield this.permissionRepo.countBy({ identifier })) == 0) {
                const permission = new Permission_1.Permission();
                permission.identifier = identifier;
                permission.description = description;
                yield this.permissionRepo.save(permission);
            }
        });
    }
}
exports.PermissionsSeeder = PermissionsSeeder;
//# sourceMappingURL=PermissionsSeeder.js.map