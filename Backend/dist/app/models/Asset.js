"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Asset = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("./User");
let Asset = class Asset extends typeorm_1.BaseEntity {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Asset.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Asset.prototype, "identifier", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Asset.prototype, "extension", void 0);
__decorate([
    typeorm_1.Column({ default: null }),
    __metadata("design:type", Date)
], Asset.prototype, "released_at", void 0);
__decorate([
    typeorm_1.CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" }),
    __metadata("design:type", Date)
], Asset.prototype, "created_at", void 0);
__decorate([
    typeorm_1.ManyToOne(() => User_1.User, (user) => user.id),
    typeorm_1.JoinTable({ name: 'released_by' }),
    __metadata("design:type", User_1.User)
], Asset.prototype, "released_by", void 0);
Asset = __decorate([
    typeorm_1.Entity("assets")
], Asset);
exports.Asset = Asset;
//# sourceMappingURL=Asset.js.map