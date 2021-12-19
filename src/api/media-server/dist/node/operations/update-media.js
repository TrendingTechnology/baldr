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
var path_1 = __importDefault(require("path"));
var child_process_1 = __importDefault(require("child_process"));
var fs_1 = __importDefault(require("fs"));
var media_manager_1 = require("@bldr/media-manager");
var file_reader_writer_1 = require("@bldr/file-reader-writer");
var titles_1 = require("@bldr/titles");
var config_1 = require("@bldr/config");
var media_data_collector_1 = require("@bldr/media-data-collector");
var rest_api_1 = require("../rest-api");
var config = (0, config_1.getConfig)();
var ErrorMessageCollector = /** @class */ (function () {
    function ErrorMessageCollector() {
        /**
         * A container array for all error messages send out via the REST API.
         */
        this.messages = [];
    }
    ErrorMessageCollector.prototype.addError = function (filePath, error) {
        var e = error;
        console.log(error);
        var relPath = filePath.replace(config.mediaServer.basePath, '');
        relPath = relPath.replace(/^\//, '');
        // eslint-disable-next-line
        var msg = "".concat(relPath, ": [").concat(e.name, "] ").concat(e.message);
        console.log(msg);
        this.messages.push(msg);
    };
    return ErrorMessageCollector;
}());
function insertMediaFileIntoDb(filePath, mediaType, errors) {
    return __awaiter(this, void 0, void 0, function () {
        var media, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    if (mediaType === 'presentations') {
                        media = (0, media_data_collector_1.buildPresentationData)(filePath);
                    }
                    else if (mediaType === 'assets') {
                        // Now only with meta data yml. Fix problems with PDF lying around.
                        if (!fs_1.default.existsSync("".concat(filePath, ".yml"))) {
                            return [2 /*return*/];
                        }
                        media = (0, media_data_collector_1.buildDbAssetData)(filePath);
                    }
                    if (media == null) {
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, rest_api_1.database.db.collection(mediaType).insertOne(media)];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    errors.addError(filePath, error_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
/**
 * Run git pull on the `basePath`
 */
function gitPull() {
    var gitPull = child_process_1.default.spawnSync('git', ['pull'], {
        cwd: config.mediaServer.basePath,
        encoding: 'utf-8'
    });
    if (gitPull.status !== 0) {
        throw new Error('git pull exits with an non-zero status code.');
    }
}
/**
 * Update the media server.
 *
 * @param full - Update with git pull.
 *
 * @returns {Promise.<Object>}
 */
function default_1(full) {
    if (full === void 0) { full = false; }
    return __awaiter(this, void 0, void 0, function () {
        var errors, titleTreeFactory, gitRevParse, assetCounter, presentationCounter, lastCommitId, begin, tree, end;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    errors = new ErrorMessageCollector();
                    titleTreeFactory = new titles_1.TreeFactory();
                    if (full) {
                        gitPull();
                    }
                    gitRevParse = child_process_1.default.spawnSync('git', ['rev-parse', 'HEAD'], {
                        cwd: config.mediaServer.basePath,
                        encoding: 'utf-8'
                    });
                    assetCounter = 0;
                    presentationCounter = 0;
                    lastCommitId = gitRevParse.stdout.replace(/\n$/, '');
                    return [4 /*yield*/, rest_api_1.database.connect()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, rest_api_1.database.initialize()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, rest_api_1.database.flushMediaFiles()];
                case 3:
                    _a.sent();
                    begin = new Date().getTime();
                    return [4 /*yield*/, rest_api_1.database.db.collection('updates').insertOne({ begin: begin, end: 0 })];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, (0, media_manager_1.walk)({
                            everyFile: function (filePath) {
                                // Delete temporary files.
                                if (filePath.match(/\.(aux|out|log|synctex\.gz|mscx,)$/) != null ||
                                    filePath.includes('Praesentation_tmp.baldr.yml') ||
                                    filePath.includes('title_tmp.txt')) {
                                    fs_1.default.unlinkSync(filePath);
                                }
                            },
                            directory: function (filePath) {
                                // Delete empty directories.
                                if (fs_1.default.existsSync(filePath) && fs_1.default.statSync(filePath).isDirectory()) {
                                    var files = fs_1.default.readdirSync(filePath);
                                    if (files.length === 0) {
                                        fs_1.default.rmdirSync(filePath);
                                    }
                                }
                            },
                            presentation: function (filePath) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, insertMediaFileIntoDb(filePath, 'presentations', errors)];
                                        case 1:
                                            _a.sent();
                                            titleTreeFactory.addTitleByPath(filePath);
                                            presentationCounter++;
                                            return [2 /*return*/];
                                    }
                                });
                            }); },
                            asset: function (filePath) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, insertMediaFileIntoDb(filePath, 'assets', errors)];
                                        case 1:
                                            _a.sent();
                                            assetCounter++;
                                            return [2 /*return*/];
                                    }
                                });
                            }); }
                        }, {
                            path: config.mediaServer.basePath
                        })
                        // .replaceOne and upsert: Problems with merged objects?
                    ];
                case 5:
                    _a.sent();
                    // .replaceOne and upsert: Problems with merged objects?
                    return [4 /*yield*/, rest_api_1.database.db.collection('folderTitleTree').deleteOne({ ref: 'root' })];
                case 6:
                    // .replaceOne and upsert: Problems with merged objects?
                    _a.sent();
                    tree = titleTreeFactory.getTree();
                    return [4 /*yield*/, rest_api_1.database.db.collection('folderTitleTree').insertOne({
                            ref: 'root',
                            tree: tree
                        })];
                case 7:
                    _a.sent();
                    (0, file_reader_writer_1.writeJsonFile)(path_1.default.join(config.mediaServer.basePath, 'title-tree.json'), tree);
                    end = new Date().getTime();
                    return [4 /*yield*/, rest_api_1.database.db
                            .collection('updates')
                            .updateOne({ begin: begin }, { $set: { end: end, lastCommitId: lastCommitId } })];
                case 8:
                    _a.sent();
                    return [2 /*return*/, {
                            finished: true,
                            begin: begin,
                            end: end,
                            duration: end - begin,
                            lastCommitId: lastCommitId,
                            errors: errors.messages,
                            count: {
                                assets: assetCounter,
                                presentations: presentationCounter
                            }
                        }];
            }
        });
    });
}
exports.default = default_1;
