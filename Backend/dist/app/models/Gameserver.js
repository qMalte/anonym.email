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
exports.GameServer = void 0;
const typeorm_1 = require("typeorm");
const Team_1 = require("./Team");
let GameServer = class GameServer extends typeorm_1.BaseEntity {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], GameServer.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], GameServer.prototype, "description", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], GameServer.prototype, "host", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], GameServer.prototype, "sshPort", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], GameServer.prototype, "sshUsername", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], GameServer.prototype, "sshPassword", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], GameServer.prototype, "gamePort", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], GameServer.prototype, "clientPort", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], GameServer.prototype, "sourceTvPort", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], GameServer.prototype, "serverPassword", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], GameServer.prototype, "RCONPassword", void 0);
__decorate([
    typeorm_1.CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" }),
    __metadata("design:type", Date)
], GameServer.prototype, "created_at", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Team_1.Team, (team) => team.id),
    __metadata("design:type", Team_1.Team)
], GameServer.prototype, "team", void 0);
GameServer = __decorate([
    typeorm_1.Entity("game_servers")
], GameServer);
exports.GameServer = GameServer;
//# sourceMappingURL=Gameserver.js.map