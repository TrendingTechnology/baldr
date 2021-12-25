"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
var open_file_manager_1 = __importDefault(require("../operations/open-file-manager"));
var open_editor_1 = __importDefault(require("../operations/open-editor"));
var update_media_1 = __importDefault(require("../operations/update-media"));
var api_1 = require("../api");
var query = __importStar(require("../query"));
function default_1() {
    var _this = this;
    var app = (0, express_1.default)();
    // Update the media server
    app.put('/', function (request, response, next) { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b, error_1;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 2, , 3]);
                    _b = (_a = response).json;
                    return [4 /*yield*/, (0, update_media_1.default)(false)];
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
    // Statistics
    app.get('/', function (request, response, next) { return __awaiter(_this, void 0, void 0, function () {
        var result, error_2;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 3, , 4]);
                    _a = {};
                    return [4 /*yield*/, api_1.database.getDocumentCounts()];
                case 1:
                    _a.count = _b.sent();
                    return [4 /*yield*/, api_1.database.listUpdateTasks()];
                case 2:
                    result = (_a.updateTasks = _b.sent(),
                        _a);
                    response.json(result);
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _b.sent();
                    next(error_2);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); });
    // flush
    app.delete('/', function (request, response, next) { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b, error_3;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 2, , 3]);
                    _b = (_a = response).json;
                    return [4 /*yield*/, api_1.database.flushMediaFiles()];
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
    app.get('/get/presentation/by-ref', function (request, response, next) { return __awaiter(_this, void 0, void 0, function () {
        var ref, _a, _b, error_4;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 2, , 3]);
                    ref = query.extractString(request.query, 'ref');
                    _b = (_a = response).json;
                    return [4 /*yield*/, api_1.database.getPresentationByRef(ref)];
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
    app.get('/get/presentations/by-substring', function (request, response, next) { return __awaiter(_this, void 0, void 0, function () {
        var search, _a, _b, error_5;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 2, , 3]);
                    search = query.extractString(request.query, 'search');
                    _b = (_a = response).json;
                    return [4 /*yield*/, api_1.database.searchPresentationBySubstring(search)];
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
    app.get('/get/asset', function (request, response, next) { return __awaiter(_this, void 0, void 0, function () {
        var scheme, uri, _a, _b, error_6;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 2, , 3]);
                    scheme = void 0;
                    uri = void 0;
                    if (request.query.ref == null && request.query.uuid != null) {
                        scheme = 'uuid';
                        uri = request.query.uuid;
                    }
                    else if (request.query.uuid == null && request.query.ref != null) {
                        scheme = 'ref';
                        uri = request.query.ref;
                    }
                    else {
                        throw new Error('Use as query ref or uuid');
                    }
                    if (typeof uri !== 'string') {
                        throw new Error('The value of the query has to be a string.');
                    }
                    _b = (_a = response).json;
                    return [4 /*yield*/, api_1.database.getAsset(scheme, uri)];
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
    app.get('/get/folder-title-tree', function (request, response, next) { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b, error_7;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 2, , 3]);
                    _b = (_a = response).json;
                    return [4 /*yield*/, api_1.database.getFolderTitleTree()];
                case 1:
                    _b.apply(_a, [_c.sent()]);
                    return [3 /*break*/, 3];
                case 2:
                    error_7 = _c.sent();
                    next(error_7);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    app.get('/get/all-asset-refs', function (request, response, next) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            try {
                response.json({});
            }
            catch (error) {
                next(error);
            }
            return [2 /*return*/];
        });
    }); });
    app.get('/get/all-asset-uuids', function (request, response, next) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            try {
                response.json({});
            }
            catch (error) {
                next(error);
            }
            return [2 /*return*/];
        });
    }); });
    /* mgmt = management */
    app.get('/mgmt/flush', function (request, response, next) { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b, error_8;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 2, , 3]);
                    _b = (_a = response).json;
                    return [4 /*yield*/, api_1.database.flushMediaFiles()];
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
    app.get('/mgmt/init', function (request, response, next) { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b, error_9;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 2, , 3]);
                    _b = (_a = response).json;
                    return [4 /*yield*/, api_1.database.initialize()];
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
    app.get('/open/editor', function (request, response, next) { return __awaiter(_this, void 0, void 0, function () {
        var ref, type, dryRun, _a, _b, error_10;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 2, , 3]);
                    ref = query.extractString(request.query, 'ref');
                    type = (0, utils_1.validateMediaType)(query.extractString(request.query, 'type', 'presentation'));
                    dryRun = query.extractBoolean(request.query, 'dry-run', false);
                    _b = (_a = response).json;
                    return [4 /*yield*/, (0, open_editor_1.default)(ref, type, dryRun)];
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
    app.get('/open/file-manager', function (request, response, next) { return __awaiter(_this, void 0, void 0, function () {
        var ref, type, create, archive, dryRun, _a, _b, error_11;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 2, , 3]);
                    ref = query.extractString(request.query, 'ref');
                    type = (0, utils_1.validateMediaType)(query.extractString(request.query, 'type'));
                    create = query.extractBoolean(request.query, 'create', false);
                    archive = query.extractBoolean(request.query, 'archive', false);
                    dryRun = query.extractBoolean(request.query, 'dry-run', false);
                    _b = (_a = response).json;
                    return [4 /*yield*/, (0, open_file_manager_1.default)(ref, type, archive, create, dryRun)];
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
    app.get('/mgmt/re-init', function (request, response, next) { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b, error_12;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 2, , 3]);
                    _b = (_a = response).json;
                    return [4 /*yield*/, api_1.database.reInitialize()];
                case 1:
                    _b.apply(_a, [_c.sent()]);
                    return [3 /*break*/, 3];
                case 2:
                    error_12 = _c.sent();
                    next(error_12);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    return app;
}
exports.default = default_1;
