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
exports.DatabaseSeeder = void 0;
const UserSeeder_1 = require("./seeds/UserSeeder");
const PermissionsSeeder_1 = require("./seeds/PermissionsSeeder");
class DatabaseSeeder {
    static run() {
        return __awaiter(this, void 0, void 0, function* () {
            yield new UserSeeder_1.UserSeeder().run();
            yield new PermissionsSeeder_1.PermissionsSeeder().run();
        });
    }
}
exports.DatabaseSeeder = DatabaseSeeder;
//# sourceMappingURL=DatabaseSeeder.js.map