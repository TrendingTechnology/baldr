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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Third party packages.
var express_1 = __importDefault(require("express"));
var utils_1 = require("../utils");
var open_parent_folder_1 = __importDefault(require("../operations/open-parent-folder"));
var open_editor_1 = __importDefault(require("../operations/open-editor"));
var update_media_1 = __importDefault(require("../operations/update-media"));
var api_1 = require("../api");
/**
 * Register the express js rest api in a giant function.
 */
function default_1() {
    var _this = this;
    var app = (0, express_1.default)();
    app.get('/', function (req, res) {
        res.json(api_1.helpMessages.navigation);
    });
    /* get */
    app.get('/get/presentation/by-ref', function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var ref, _a, _b, error_1;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 2, , 3]);
                    if (req.query.ref == null) {
                        throw new Error('You have to specify an reference (?ref=myfile).');
                    }
                    ref = req.query.ref;
                    if (typeof ref !== 'string') {
                        throw new Error('“ref” has to be a string.');
                    }
                    _b = (_a = res).json;
                    return [4 /*yield*/, api_1.database.getPresentationByRef(ref)];
                case 1:
                    _b.apply(_a, [_c.sent()]);
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _c.sent();
                    next(error_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    app.get('/get/presentations/by-substring', function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var search, _a, _b, error_2;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 2, , 3]);
                    if (req.query.search == null) {
                        throw new Error('You have to specify an parameter named search');
                    }
                    search = req.query.search;
                    if (typeof search !== 'string') {
                        throw new Error('“search” has to be a string.');
                    }
                    _b = (_a = res).json;
                    return [4 /*yield*/, api_1.database.searchPresentationBySubstring(search)];
                case 1:
                    _b.apply(_a, [_c.sent()]);
                    return [3 /*break*/, 3];
                case 2:
                    error_2 = _c.sent();
                    next(error_2);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    app.get('/get/asset', function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var scheme, uri, _a, _b, error_3;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 2, , 3]);
                    scheme = void 0;
                    uri = void 0;
                    if (req.query.ref == null && req.query.uuid != null) {
                        scheme = 'uuid';
                        uri = req.query.uuid;
                    }
                    else if (req.query.uuid == null && req.query.ref != null) {
                        scheme = 'ref';
                        uri = req.query.ref;
                    }
                    else {
                        throw new Error('Use as query ref or uuid');
                    }
                    if (typeof uri !== 'string') {
                        throw new Error('The value of the query has to be a string.');
                    }
                    _b = (_a = res).json;
                    return [4 /*yield*/, api_1.database.getAsset(scheme, uri)];
                case 1:
                    _b.apply(_a, [_c.sent()]);
                    return [3 /*break*/, 3];
                case 2:
                    error_3 = _c.sent();
                    next(error_3);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    app.get('/get/folder-title-tree', function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b, error_4;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 2, , 3]);
                    _b = (_a = res).json;
                    return [4 /*yield*/, api_1.database.getFolderTitleTree()];
                case 1:
                    _b.apply(_a, [_c.sent()]);
                    return [3 /*break*/, 3];
                case 2:
                    error_4 = _c.sent();
                    next(error_4);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    app.get('/get/all-asset-refs', function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            try {
                res.json({});
            }
            catch (error) {
                next(error);
            }
            return [2 /*return*/];
        });
    }); });
    app.get('/get/all-asset-uuids', function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            try {
                res.json({});
            }
            catch (error) {
                next(error);
            }
            return [2 /*return*/];
        });
    }); });
    /* mgmt = management */
    app.get('/mgmt/flush', function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b, error_5;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 2, , 3]);
                    _b = (_a = res).json;
                    return [4 /*yield*/, api_1.database.flushMediaFiles()];
                case 1:
                    _b.apply(_a, [_c.sent()]);
                    return [3 /*break*/, 3];
                case 2:
                    error_5 = _c.sent();
                    next(error_5);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    app.get('/mgmt/init', function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b, error_6;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 2, , 3]);
                    _b = (_a = res).json;
                    return [4 /*yield*/, api_1.database.initialize()];
                case 1:
                    _b.apply(_a, [_c.sent()]);
                    return [3 /*break*/, 3];
                case 2:
                    error_6 = _c.sent();
                    next(error_6);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    app.get('/mgmt/open', function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var query, archive, create, ref, type, _a, _b, _c, _d, error_7;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    _e.trys.push([0, 5, , 6]);
                    query = req.query;
                    if (query.ref == null) {
                        throw new Error('You have to specify an reference (?ref=myfile).');
                    }
                    if (query.with == null) {
                        query.with = 'editor';
                    }
                    if (query.type == null) {
                        query.type = 'presentations';
                    }
                    archive = 'archive' in query;
                    create = 'create' in query;
                    ref = (0, api_1.extractString)(query, 'ref');
                    type = (0, utils_1.validateMediaType)((0, api_1.extractString)(query, 'type'));
                    if (!(query.with === 'editor')) return [3 /*break*/, 2];
                    _b = (_a = res).json;
                    return [4 /*yield*/, (0, open_editor_1.default)(ref, type)];
                case 1:
                    _b.apply(_a, [_e.sent()]);
                    return [3 /*break*/, 4];
                case 2:
                    if (!(query.with === 'folder')) return [3 /*break*/, 4];
                    _d = (_c = res).json;
                    return [4 /*yield*/, (0, open_parent_folder_1.default)(ref, type, archive, create)];
                case 3:
                    _d.apply(_c, [_e.sent()]);
                    _e.label = 4;
                case 4: return [3 /*break*/, 6];
                case 5:
                    error_7 = _e.sent();
                    next(error_7);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    }); });
    app.get('/mgmt/re-init', function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b, error_8;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 2, , 3]);
                    _b = (_a = res).json;
                    return [4 /*yield*/, api_1.database.reInitialize()];
                case 1:
                    _b.apply(_a, [_c.sent()]);
                    return [3 /*break*/, 3];
                case 2:
                    error_8 = _c.sent();
                    next(error_8);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    app.get('/mgmt/update', function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b, error_9;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 2, , 3]);
                    _b = (_a = res).json;
                    return [4 /*yield*/, (0, update_media_1.default)(false)];
                case 1:
                    _b.apply(_a, [_c.sent()]);
                    return [3 /*break*/, 3];
                case 2:
                    error_9 = _c.sent();
                    next(error_9);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    /* stats = statistics */
    app.get('/stats/count', function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b, error_10;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 2, , 3]);
                    _b = (_a = res).json;
                    return [4 /*yield*/, api_1.database.getDocumentCounts()];
                case 1:
                    _b.apply(_a, [_c.sent()]);
                    return [3 /*break*/, 3];
                case 2:
                    error_10 = _c.sent();
                    next(error_10);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    app.get('/stats/updates', function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b, error_11;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 2, , 3]);
                    _b = (_a = res).json;
                    return [4 /*yield*/, api_1.database.listUpdateTasks()];
                case 1:
                    _b.apply(_a, [_c.sent()]);
                    return [3 /*break*/, 3];
                case 2:
                    error_11 = _c.sent();
                    next(error_11);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    return app;
}
exports.default = default_1;
