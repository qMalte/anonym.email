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
exports.Model = void 0;
const knex_1 = __importDefault(require("knex"));
const knexfile_1 = __importDefault(require("../../knexfile"));
class Model {
    static all() {
        return __awaiter(this, void 0, void 0, function* () {
            return this._knex(this.table).select();
        });
    }
    static find(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._knex(this.table).select().where(id).first();
        });
    }
    static where(searchColumn, value) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._knex(this.table).select().where(searchColumn, value);
        });
    }
    static whereOne(searchColumn, value) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._knex(this.table).select().where(searchColumn, value).first();
        });
    }
    create() {
        return __awaiter(this, void 0, void 0, function* () {
            return Model._knex(this.constructor.table).insert(this);
        });
    }
    update() {
        return __awaiter(this, void 0, void 0, function* () {
            return Model._knex(this.constructor.table).update(this).where('id', this.id);
        });
    }
    delete() {
        return __awaiter(this, void 0, void 0, function* () {
            return Model._knex(this.constructor.table).delete().where('id', this.id);
        });
    }
}
exports.Model = Model;
Model._knex = knex_1.default(knexfile_1.default);
//# sourceMappingURL=Model.js.map