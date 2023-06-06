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
exports.AssetController = void 0;
const validator_1 = __importDefault(require("validator"));
const UserService_1 = require("../services/UserService");
const Asset_1 = require("../models/Asset");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const ClamAV_1 = require("../services/ClamAV");
const StringHelper_1 = require("../../helpers/StringHelper");
const typeorm_1 = require("typeorm");
const AuthenticationResources_1 = require("../../resources/AuthenticationResources");
const EntityRegistry_1 = require("../../database/EntityRegistry");
class AssetController {
    GetMetaData(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.params.asset_id == null || !validator_1.default.isNumeric(req.params.asset_id.toString())) {
                return res.status(400).send({
                    reason: 'validation_error'
                });
            }
            if (!(yield UserService_1.UserService.hasPermission(res.locals.user_id, 'assets', false))) {
                return res.status(403).send(AuthenticationResources_1.AuthenticationResources.PermissionDenied);
            }
            try {
                const asset = yield EntityRegistry_1.EntityRegistry.getInstance().Asset.findOneBy({ id: +req.params.asset_id });
                if (asset != null) {
                    res.status(200).send(asset);
                }
                else {
                    res.status(404).end();
                }
            }
            catch (e) {
                res.status(500).end();
            }
        });
    }
    GetAssetFile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(yield UserService_1.UserService.hasPermission(res.locals.user_id, 'assets', false))) {
                return res.status(403).send(AuthenticationResources_1.AuthenticationResources.PermissionDenied);
            }
            if (req.params.asset_id == null || !validator_1.default.isNumeric(req.params.asset_id.toString())) {
                return res.status(400).send({
                    reason: 'validation_error'
                });
            }
            try {
                const asset = yield EntityRegistry_1.EntityRegistry.getInstance().Asset.findOneBy({ id: +req.params.asset_id });
                if (asset != null) {
                    const filePath = `${__dirname}/../../storage/assets/${asset.identifier}.${asset.extension}`;
                    if (fs_1.default.existsSync(filePath)) {
                        res.status(200).sendFile(path_1.default.resolve(filePath));
                    }
                    else {
                        res.status(500).end();
                    }
                }
                else {
                    res.status(404).end();
                }
            }
            catch (e) {
                res.status(500).end();
            }
        });
    }
    PostAsset(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.files == null) {
                res.status(400).send({
                    reason: 'files_fields_empty'
                });
                return;
            }
            const files = req.files;
            const allowedMimetypes = ['image/png', 'image/jpg', 'image/jpeg'];
            const maxAllowedSize = 1024 * 1024;
            for (const file of files) {
                if (!allowedMimetypes.includes(file.mimetype)) {
                    return res.status(400).send({
                        reason: 'mimetype_unsupported'
                    });
                }
                if (file.size > maxAllowedSize) {
                    return res.status(400).send({
                        reason: 'file_size_exceeds_limit'
                    });
                }
                if (!(yield new ClamAV_1.ClamAV().isFileClean(file.path))) {
                    return res.status(400).send({
                        reason: 'malware_detected'
                    });
                }
                const fileNameArr = file.originalname.split(".");
                const mimetypeArr = file.mimetype.split("/");
                if (fileNameArr.length < 1 || mimetypeArr.length < 1) {
                    return res.status(400).send({
                        reason: 'validation_error'
                    });
                }
                try {
                    const asset = new Asset_1.Asset();
                    asset.extension = mimetypeArr[mimetypeArr.length - 1];
                    asset.identifier = StringHelper_1.StringHelper.Generate(16);
                    while ((yield EntityRegistry_1.EntityRegistry.getInstance().Asset.countBy({ identifier: asset.identifier })) > 0) {
                        asset.identifier = StringHelper_1.StringHelper.Generate(16);
                    }
                    const path = __dirname + '/../../storage/assets/' + asset.identifier + '.' + asset.extension;
                    yield fs_1.default.renameSync(file.path, path);
                    yield asset.save();
                    return res.status(200).send(asset);
                }
                catch (e) {
                    console.log(e);
                    return res.status(500).send({
                        reason: 'save_error'
                    });
                }
            }
            res.status(500).end();
        });
    }
    DelAsset(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(yield UserService_1.UserService.hasPermission(res.locals.user_id, 'assets', true))) {
                return res.status(403).send(AuthenticationResources_1.AuthenticationResources.PermissionDenied);
            }
            if (req.params.asset_id == null || !validator_1.default.isNumeric(req.params.asset_id.toString())) {
                return res.status(400).send({
                    reason: 'validation_error'
                });
            }
            try {
                const asset = yield EntityRegistry_1.EntityRegistry.getInstance().Asset.findOneBy({ id: +req.params.asset_id });
                if (asset == null) {
                    return res.status(404).end();
                }
                const path = __dirname + '/../../storage/assets/' + asset.identifier + '.' + asset.extension;
                if (fs_1.default.existsSync(path)) {
                    yield fs_1.default.unlinkSync(path);
                }
                yield asset.save();
                return res.status(200).end();
            }
            catch (e) {
                return res.status(500).send({
                    reason: 'delete_error'
                });
            }
        });
    }
    GetPendingAssets(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(yield UserService_1.UserService.hasPermission(res.locals.user_id, 'assets_signing', false))) {
                return res.status(403).send(AuthenticationResources_1.AuthenticationResources.PermissionDenied);
            }
            try {
                const assets = yield EntityRegistry_1.EntityRegistry.getInstance().Asset.findBy({ released_at: typeorm_1.IsNull() });
                res.status(200).send(assets);
            }
            catch (e) {
                res.status(500).end();
            }
        });
    }
    PostApprovedAsset(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.params.asset_id == null || !validator_1.default.isNumeric(req.params.asset_id.toString())) {
                return res.status(400).send({
                    reason: 'validation_error'
                });
            }
            if (!(yield UserService_1.UserService.hasPermission(res.locals.user_id, 'assets_signing', true))) {
                return res.status(403).send(AuthenticationResources_1.AuthenticationResources.PermissionDenied);
            }
            try {
                const asset = yield EntityRegistry_1.EntityRegistry.getInstance().Asset.findOneBy({ id: +req.params.asset_id });
                if (asset == null) {
                    return res.status(404).end();
                }
                asset.released_at = new Date();
                asset.released_by = res.locals.user_id;
                yield asset.save();
                res.status(200).end();
            }
            catch (e) {
                res.status(500).end();
            }
        });
    }
}
exports.AssetController = AssetController;
//# sourceMappingURL=AssetController.js.map