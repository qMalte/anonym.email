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
exports.SettingsSeeder = void 0;
const SetupService_1 = require("../../app/services/SetupService");
class SettingsSeeder {
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            yield SetupService_1.SetupService.EnsureIfExists('enableRegistration', true);
            yield SetupService_1.SetupService.EnsureIfExists('userRequireValidMail', true);
            yield SetupService_1.SetupService.EnsureIfExists('sessionTimeout', 60);
        });
    }
}
exports.SettingsSeeder = SettingsSeeder;
//# sourceMappingURL=SettingsSeeder.js.map