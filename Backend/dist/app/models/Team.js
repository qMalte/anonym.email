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
exports.Team = void 0;
const typeorm_1 = require("typeorm");
const Gameserver_1 = require("./Gameserver");
let Team = class Team extends typeorm_1.BaseEntity {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Team.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ default: null }),
    __metadata("design:type", Number)
], Team.prototype, "image_id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Team.prototype, "name", void 0);
__decorate([
    typeorm_1.OneToMany(() => Gameserver_1.GameServer, (gameServer) => gameServer.id),
    __metadata("design:type", Array)
], Team.prototype, "gameServers", void 0);
Team = __decorate([
    typeorm_1.Entity("teams")
], Team);
exports.Team = Team;
// Spieler
// Matches
// Bild
// Namen
// SocialMedia
// Ligen / Erfolge
//# sourceMappingURL=Team.js.map