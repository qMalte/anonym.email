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
exports.UserSeeder = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const User_1 = require("../../app/models/User");
const DatabaseProvider_1 = require("../DatabaseProvider");
class UserSeeder {
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const userRepo = DatabaseProvider_1.AppDataSource.getRepository(User_1.User);
            if ((yield userRepo.count()) < 1) {
                for (let i = 0; i < 8; i++) {
                    const user = new User_1.User();
                    user.username = "user#" + i;
                    user.password = yield bcrypt_1.default.hash('www.weneflix.de', 10);
                    user.firstname = "Max";
                    user.lastname = "Mustermann";
                    user.zip = 12345;
                    user.birthday = new Date();
                    user.city = "Essen";
                    user.country = "Deutschland";
                    user.email = user.username + '@mail.de';
                    user.houseNr = '123';
                    user.nationality = "German";
                    user.street = 'Musterstraße';
                    user.phone = '+49 (201) 85891444';
                    user.isActive = true;
                    yield userRepo.save(user);
                }
            }
        });
    }
}
exports.UserSeeder = UserSeeder;
//# sourceMappingURL=UserSeeder.js.map