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
exports.SetupService = void 0;
const SetupEntity_1 = require("../models/SetupEntity");
const DatabaseProvider_1 = require("../../database/DatabaseProvider");
class SetupService {
    static GetEntity(identifier) {
        return __awaiter(this, void 0, void 0, function* () {
            const settingsRepo = DatabaseProvider_1.AppDataSource.getRepository(SetupEntity_1.SetupEntity);
            return yield settingsRepo.findOneBy({ identifier });
        });
    }
    static EnsureIfExists(identifier, value) {
        return __awaiter(this, void 0, void 0, function* () {
            const settingsRepo = DatabaseProvider_1.AppDataSource.getRepository(SetupEntity_1.SetupEntity);
            if ((yield settingsRepo.countBy({ identifier })) == 0) {
                const setupEntity = new SetupEntity_1.SetupEntity();
                setupEntity.identifier = identifier;
                if (typeof value == 'string') {
                    setupEntity.stringValue = value;
                }
                else if (typeof value == 'number') {
                    setupEntity.numericValue = value;
                }
                else if (typeof value == 'boolean') {
                    setupEntity.boolValue = value;
                }
                yield settingsRepo.save(setupEntity);
            }
        });
    }
}
exports.SetupService = SetupService;
//# sourceMappingURL=SetupService.js.map