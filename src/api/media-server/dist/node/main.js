#! /usr/bin/env node
"use strict";
/**
 * The REST API and command line interface of the BALDR media server.
 *
 * # Media types:
 *
 * - presentation (`Presentation()`)
 * - asset (`Asset()`)
 *   - multipart asset (`filename.jpg`, `filename_no002.jpg`, `filename_no003.jpg`)
 *
 * # Definition of the objects:
 *
 * A _presentation_ is a YAML file for the BALDR presentation app. It must have
 * the file name scheme `*.baldr.yml`. The media server stores the whole YAML
 * file in the MongoDB database.
 *
 * A _asset_ is a media file which has a meta data file in the YAML format.
 * The file name scheme for this meta data file is `media-file.jpg.yml`. The
 * suffix `.yml` has to be appended. Only the content of the meta data file
 * is stored into the database.
 *
 * # REST API
 * - `get`
 *   - `folder-title-tree`: Get the folder title tree as a hierarchical json
 *     object.
 * - `mgmt`
 *   - `flush`: Delete all media files (assets, presentations) from the database.
 *   - `init`: Initialize the MongoDB database
 *   - `open`: Open a media file specified by an ID. This query parameters are
 *     available:
 *       - `ref`: The ID of the media file (required).
 *       - `type`: `presentations`, `assets`. The default value is
 *         `presentations.`
 *       - `with`: `editor` specified in `config.mediaServer.editor`
 *         (`/etc/baldr.json`) or `folder` to open the parent folder of the
 *         given media file. The default value is `editor`
 *       - `archive`: True if present, false by default. Open the file or the
           folder in the corresponding archive folder structure.
 *       - `create`: True if present, false by default. Create the possibly none
            existing directory structure in a recursive manner.
 *   - `re-init`: Re-Initialize the MongoDB database (Drop all collections and
 *     initialize)
 *   - `update`: Update the media server database (Flush and insert).
 *   - `query`: Getting results by using query parameters. This query parameters
 *     are available:
 *      - `type`: `assets` (default), `presentations` (what)
 *      - `method`: `exactMatch`, `substringSearch` (default) (how).
 *          - `exactMatch`: The query parameter `search` must be a perfect match
 *            to a top level database field to get a result.
 *          - `substringSearch`: The query parameter `search` is only a
 *            substring of the string to search in.
 *      - `field`: `ref` (default), `title`, etc ... (where).
 *      - `search`: Some text to search for (search for).
 *      - `result`: `fullObjects` (default), `dynamicSelect`
 * - `stats`:
 *   - `count`: Count / sum of the media files (assets, presentations) in the
 *     database.
 *   - `updates`: Journal of the update processes with timestamps.
 *
 * @module @bldr/media-server
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.database = exports.openArchivesInFileManager = void 0;
// Node packages.
var child_process_1 = __importDefault(require("child_process"));
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
// Third party packages.
var cors_1 = __importDefault(require("cors"));
var express_1 = __importDefault(require("express"));
// Project packages.
var config_ng_1 = require("@bldr/config");
var core_browser_1 = require("@bldr/core-browser");
var yaml_1 = require("@bldr/yaml");
var media_manager_1 = require("@bldr/media-manager");
var file_reader_writer_1 = require("@bldr/file-reader-writer");
var titles_1 = require("@bldr/titles");
var operations_1 = require("./operations");
var mongodb_connector_1 = require("@bldr/mongodb-connector");
var client_media_models_1 = require("@bldr/client-media-models");
// Submodules.
var seating_plan_1 = require("./seating-plan");
var operations_2 = require("./operations");
Object.defineProperty(exports, "openArchivesInFileManager", { enumerable: true, get: function () { return operations_2.openArchivesInFileManager; } });
var config = config_ng_1.getConfig();
/**
 * Base path of the media server file store.
 */
var basePath = config.mediaServer.basePath;
/**
 * A container array for all error messages send out via the REST API.
 */
var errors = [];
/* Media objects **************************************************************/
var titleTreeFactory;
/**
 * Base class to be extended.
 */
var ServerMediaFile = /** @class */ (function () {
    function ServerMediaFile(filePath) {
        this.absPath_ = path_1.default.resolve(filePath);
        this.path = filePath.replace(basePath, '').replace(/^\//, '');
        this.filename = path_1.default.basename(filePath);
    }
    /**
     * Add metadata from the file system, like file size or timeModifed.
     */
    ServerMediaFile.prototype.startBuild = function () {
        this.extension = core_browser_1.getExtension(this.absPath_);
        if (this.extension != null) {
            this.basename_ = path_1.default.basename(this.absPath_, "." + this.extension);
        }
        else {
            this.basename_ = path_1.default.basename(this.absPath_);
        }
        return this;
    };
    /**
     * Delete the temporary properties of the object. Temporary properties end
     * with `_`.
     */
    ServerMediaFile.prototype.cleanTmpProperties = function () {
        for (var property in this) {
            if (property.match(/_$/) != null) {
                // eslint-disable-next-line
                delete this[property];
            }
        }
        return this;
    };
    /**
     * Merge an object into the class object. Properties can be in the
     * `snake_case` or `kebab-case` form. They are converted into `camelCase` in a
     * recursive fashion.
     *
     * @param properties - Add an object to the class properties.
     */
    ServerMediaFile.prototype.importProperties = function (properties) {
        if (typeof properties === 'object') {
            properties = yaml_1.convertPropertiesSnakeToCamel(properties);
            for (var property in properties) {
                this[property] = properties[property];
            }
        }
    };
    /**
     * Prepare the object for the insert into the MongoDB database
     * Generate `id` and `title` if this properties are not present.
     */
    ServerMediaFile.prototype.build = function () {
        this.startBuild();
        if (this.id == null && this.basename_ != null) {
            this.id = core_browser_1.asciify(this.basename_);
        }
        if (this.title == null && this.id != null) {
            this.title = core_browser_1.deasciify(this.id);
        }
        this.cleanTmpProperties();
        return this;
    };
    return ServerMediaFile;
}());
/**
 * This class is used both for the entries in the MongoDB database as well for
 * the queries.
 */
var ServerMediaAsset = /** @class */ (function (_super) {
    __extends(ServerMediaAsset, _super);
    /**
     * @param filePath - The file path of the media file.
     */
    function ServerMediaAsset(filePath) {
        var _this = _super.call(this, filePath) || this;
        /**
         * Indicates whether the media asset has a preview image (`_preview.jpg`).
         */
        _this.previewImage = false;
        /**
         * Indicates wheter the media asset has a waveform image (`_waveform.png`).
         */
        _this.hasWaveform = false;
        _this.infoFile_ = _this.absPath_ + ".yml";
        var data = file_reader_writer_1.readYamlFile(_this.infoFile_);
        _this.importProperties(data);
        return _this;
    }
    ServerMediaAsset.prototype.detectPreview = function () {
        var previewImage = this.absPath_ + "_preview.jpg";
        if (fs_1.default.existsSync(previewImage)) {
            this.previewImage = true;
        }
        return this;
    };
    ServerMediaAsset.prototype.detectWaveform = function () {
        var waveformImage = this.absPath_ + "_waveform.png";
        if (fs_1.default.existsSync(waveformImage)) {
            this.hasWaveform = true;
        }
        return this;
    };
    /**
     * Search for mutlipart assets. The naming scheme of multipart assets is:
     * `filename.jpg`, `filename_no002.jpg`, `filename_no003.jpg`
     */
    ServerMediaAsset.prototype.detectMultiparts = function () {
        var _this = this;
        var nextAssetFileName = function (count) {
            var suffix;
            if (count < 10) {
                suffix = "_no00" + count;
            }
            else if (count < 100) {
                suffix = "_no0" + count;
            }
            else if (count < 1000) {
                suffix = "_no" + count;
            }
            else {
                throw new Error(_this.absPath_ + " multipart asset counts greater than 100 are not supported.");
            }
            var basePath = _this.absPath_;
            var fileName;
            if (_this.extension != null) {
                basePath = _this.absPath_.replace("." + _this.extension, '');
                fileName = "" + basePath + suffix + "." + _this.extension;
            }
            else {
                fileName = "" + basePath + suffix;
            }
            return fileName;
        };
        var count = 2;
        while (fs_1.default.existsSync(nextAssetFileName(count))) {
            count += 1;
        }
        count -= 1; // The counter is increased before the file system check.
        if (count > 1) {
            this.multiPartCount = count;
        }
        return this;
    };
    ServerMediaAsset.prototype.detectMimeType = function () {
        if (this.extension != null) {
            this.mimeType = client_media_models_1.mimeTypeManager.extensionToType(this.extension);
        }
        return this;
    };
    ServerMediaAsset.prototype.startBuild = function () {
        _super.prototype.startBuild.call(this);
        this.detectMultiparts()
            .detectPreview()
            .detectWaveform()
            .detectMimeType();
        return this;
    };
    return ServerMediaAsset;
}(ServerMediaFile));
/**
 * The whole presentation YAML file converted to an Javascript object. All
 * properties are in `camelCase`.
 */
var ServerPresentation = /** @class */ (function (_super) {
    __extends(ServerPresentation, _super);
    function ServerPresentation(filePath) {
        var _a, _b, _c, _d, _e;
        var _this = _super.call(this, filePath) || this;
        var data = file_reader_writer_1.readYamlFile(filePath);
        if (data != null)
            _this.importProperties(data);
        var deepTitle = titleTreeFactory.addTitleByPath(filePath);
        if (_this.meta == null) {
            // eslint-disable-next-line
            _this.meta = {};
        }
        if (((_a = _this.meta) === null || _a === void 0 ? void 0 : _a.ref) == null) {
            _this.meta.ref = deepTitle.ref;
        }
        if (((_b = _this.meta) === null || _b === void 0 ? void 0 : _b.title) == null) {
            _this.meta.title = deepTitle.title;
        }
        if (((_c = _this.meta) === null || _c === void 0 ? void 0 : _c.subtitle) == null) {
            _this.meta.subtitle = deepTitle.subtitle;
        }
        if (((_d = _this.meta) === null || _d === void 0 ? void 0 : _d.curriculum) == null) {
            _this.meta.curriculum = deepTitle.curriculum;
        }
        if (((_e = _this.meta) === null || _e === void 0 ? void 0 : _e.grade) == null) {
            _this.meta.grade = deepTitle.grade;
        }
        _this.title = core_browser_1.stripTags(_this.meta.title);
        _this.titleSubtitle = _this.titleSubtitle_();
        _this.allTitlesSubtitle = _this.allTitlesSubtitle_(deepTitle);
        _this.ref = _this.meta.ref;
        return _this;
    }
    /**
     * Generate the plain text version of `this.meta.title (this.meta.subtitle)`
     */
    ServerPresentation.prototype.titleSubtitle_ = function () {
        var _a;
        if (((_a = this.meta) === null || _a === void 0 ? void 0 : _a.subtitle) != null) {
            return this.title + " (" + core_browser_1.stripTags(this.meta.subtitle) + ")";
        }
        else {
            return this.title;
        }
    };
    /**
     * Generate the plain text version of `folderTitles.allTitles
     * (this.meta.subtitle)`
     *
     * For example:
     *
     * 6. Jahrgangsstufe / Lernbereich 2: Musik - Mensch - Zeit /
     * Johann Sebastian Bach: Musik als Bekenntnis /
     * Johann Sebastian Bachs Reise nach Berlin 1747 (Ricercar a 3)
     */
    ServerPresentation.prototype.allTitlesSubtitle_ = function (folderTitles) {
        var _a;
        var all = folderTitles.allTitles;
        if (((_a = this.meta) === null || _a === void 0 ? void 0 : _a.subtitle) != null) {
            all = all + " (" + this.meta.subtitle + ")";
        }
        return core_browser_1.stripTags(all);
    };
    return ServerPresentation;
}(ServerMediaFile));
function insertObjectIntoDb(filePath, mediaType) {
    return __awaiter(this, void 0, void 0, function () {
        var object, e_1, error, relPath, msg;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    if (mediaType === 'presentations') {
                        object = new ServerPresentation(filePath);
                    }
                    else if (mediaType === 'assets') {
                        // Now only with meta data yml. Fix problems with PDF lying around.
                        if (!fs_1.default.existsSync(filePath + ".yml"))
                            return [2 /*return*/];
                        object = new ServerMediaAsset(filePath);
                    }
                    if (object == null)
                        return [2 /*return*/];
                    object = object.build();
                    return [4 /*yield*/, exports.database.db.collection(mediaType).insertOne(object)];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    e_1 = _a.sent();
                    error = e_1;
                    console.log(error);
                    relPath = filePath.replace(config.mediaServer.basePath, '');
                    relPath = relPath.replace(new RegExp('^/'), '');
                    msg = relPath + ": [" + error.name + "] " + error.message;
                    console.log(msg);
                    errors.push(msg);
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
        cwd: basePath,
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
function update(full) {
    if (full === void 0) { full = false; }
    return __awaiter(this, void 0, void 0, function () {
        var gitRevParse, assetCounter, presentationCounter, lastCommitId, begin, tree, end;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // To get a fresh title tree, otherwise changes of the titles are not updated
                    titleTreeFactory = new titles_1.TreeFactory();
                    if (full) {
                        gitPull();
                    }
                    gitRevParse = child_process_1.default.spawnSync('git', ['rev-parse', 'HEAD'], {
                        cwd: basePath,
                        encoding: 'utf-8'
                    });
                    assetCounter = 0;
                    presentationCounter = 0;
                    lastCommitId = gitRevParse.stdout.replace(/\n$/, '');
                    return [4 /*yield*/, exports.database.connect()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, exports.database.initialize()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, exports.database.flushMediaFiles()];
                case 3:
                    _a.sent();
                    begin = new Date().getTime();
                    return [4 /*yield*/, exports.database.db.collection('updates').insertOne({ begin: begin, end: 0 })];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, media_manager_1.walk({
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
                                        case 0: return [4 /*yield*/, insertObjectIntoDb(filePath, 'presentations')];
                                        case 1:
                                            _a.sent();
                                            presentationCounter++;
                                            return [2 /*return*/];
                                    }
                                });
                            }); },
                            asset: function (filePath) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, insertObjectIntoDb(filePath, 'assets')];
                                        case 1:
                                            _a.sent();
                                            assetCounter++;
                                            return [2 /*return*/];
                                    }
                                });
                            }); }
                        }, {
                            path: basePath
                        })
                        // .replaceOne and upsert: Problems with merged objects?
                    ];
                case 5:
                    _a.sent();
                    // .replaceOne and upsert: Problems with merged objects?
                    return [4 /*yield*/, exports.database.db.collection('folderTitleTree').deleteOne({ ref: 'root' })];
                case 6:
                    // .replaceOne and upsert: Problems with merged objects?
                    _a.sent();
                    tree = titleTreeFactory.getTree();
                    return [4 /*yield*/, exports.database.db.collection('folderTitleTree').insertOne({
                            ref: 'root',
                            tree: tree
                        })];
                case 7:
                    _a.sent();
                    file_reader_writer_1.writeJsonFile(path_1.default.join(config.mediaServer.basePath, 'title-tree.json'), tree);
                    end = new Date().getTime();
                    return [4 /*yield*/, exports.database.db
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
                            errors: errors,
                            count: {
                                assets: assetCounter,
                                presentations: presentationCounter
                            }
                        }];
            }
        });
    });
}
/* Express Rest API ***********************************************************/
/**
 * This object hold jsons for displaying help messages in the browser on
 * some entry point urls.
 *
 * Update docs on the top of this file in the JSDoc block.
 */
var helpMessages = {
    navigation: {
        get: {
            'folder-title-tree': 'Get the folder title tree as a hierarchical json object.'
        },
        mgmt: {
            flush: 'Delete all media files (assets, presentations) from the database.',
            init: 'Initialize the MongoDB database.',
            open: {
                '#description': 'Open a media file specified by an ID.',
                '#examples': [
                    '/media/mgmt/open?id=Egmont',
                    '/media/mgmt/open?with=editor&id=Egmont',
                    '/media/mgmt/open?with=editor&type=presentations&id=Egmont',
                    '/media/mgmt/open?with=folder&type=presentations&id=Egmont&archive=true',
                    '/media/mgmt/open?with=folder&type=presentations&id=Egmont&archive=true&create=true',
                    '/media/mgmt/open?with=editor&type=assets&id=Beethoven_Ludwig-van',
                    '/media/mgmt/open?with=folder&type=assets&id=Beethoven_Ludwig-van'
                ],
                '#parameters': {
                    ref: 'The ID of the media file (required).',
                    type: '`presentations`, `assets`. The default value is `presentations.`',
                    with: '`editor` specified in `config.mediaServer.editor` (`/etc/baldr.json`) or `folder` to open the parent folder of the given media file. The default value is `editor`.',
                    archive: 'True if present, false by default. Open the file or the folder in the corresponding archive folder structure.',
                    create: 'True if present, false by default. Create the possibly non existing directory structure in a recursive manner.'
                }
            },
            're-init': 'Re-Initialize the MongoDB database (Drop all collections and initialize).',
            update: 'Update the media server database (Flush and insert).'
        },
        query: {
            '#description': 'Get results by using query parameters',
            '#examples': [
                '/media/query?type=assets&field=ref&method=exactMatch&search=Egmont-Ouverture',
                '/media/query?type=assets&field=uuid&method=exactMatch&search=c64047d2-983d-4009-a35f-02c95534cb53',
                '/media/query?type=presentations&field=ref&method=exactMatch&search=Beethoven_Marmotte',
                '/media/query?type=assets&field=path&method=substringSearch&search=35_Bilder-Ausstellung_Ueberblick&result=fullObjects',
                '/media/query?type=assets&field=path&method=substringSearch&search=35_Bilder-Ausstellung_Ueberblick&result=dynamicSelect'
            ],
            '#parameters': {
                type: '`assets` (default), `presentations` (what)',
                method: '`exactMatch`, `substringSearch` (default) (how). `exactMatch`: The query parameter `search` must be a perfect match to a top level database field to get a result. `substringSearch`: The query parameter `search` is only a substring of the string to search in.',
                field: '`ref` (default), `title`, etc ... (where).',
                search: 'Some text to search for (search for).',
                result: '`fullObjects` (default), `dynamicSelect`'
            }
        },
        stats: {
            count: 'Count / sum of the media files (assets, presentations) in the database.',
            updates: 'Journal of the update processes with timestamps.'
        }
    }
};
function extractString(query, propertyName, defaultValue) {
    if (defaultValue === void 0) { defaultValue = null; }
    if (query == null ||
        typeof query !== 'object' ||
        query[propertyName] == null ||
        typeof query[propertyName] !== 'string') {
        if (defaultValue != null) {
            return defaultValue;
        }
        else {
            throw new Error("No value for property " + propertyName + " in the query object.");
        }
    }
    return query[propertyName];
}
/**
 * Register the express js rest api in a giant function.
 */
function registerMediaRestApi() {
    var _this = this;
    var db = exports.database.db;
    // https://stackoverflow.com/a/38427476/10193818
    function escapeRegex(text) {
        return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
    }
    var app = express_1.default();
    app.get('/', function (req, res) {
        res.json(helpMessages.navigation);
    });
    /* query */
    app.get('/query', function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var query, type, methods, method, field, collection, result, find, findObject, search, regex, $match, $project, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    query = req.query;
                    if (Object.keys(query).length === 0) {
                        res.status(500).send({
                            error: {
                                msg: 'Missing query parameters!',
                                navigationGuide: helpMessages.navigation.query
                            }
                        });
                        return [2 /*return*/];
                    }
                    type = void 0;
                    if (query.type != null && typeof query.type === 'string') {
                        type = operations_1.validateMediaType(query.type);
                    }
                    else {
                        type = 'assets';
                    }
                    methods = ['exactMatch', 'substringSearch'];
                    method = extractString(query, 'method', 'substringSearch');
                    if (!methods.includes(method)) {
                        throw new Error("Unkown method \u201C" + method + "\u201D! Allowed methods: " + methods.join(', '));
                    }
                    field = extractString(query, 'field', 'ref');
                    // result
                    if (!('result' in query))
                        query.result = 'fullObjects';
                    collection = db.collection(type);
                    result = void 0;
                    find = void 0;
                    if (!(query.method === 'exactMatch')) return [3 /*break*/, 2];
                    findObject = {};
                    findObject[field] = query.search;
                    find = collection.find(findObject, { projection: { _id: 0 } });
                    return [4 /*yield*/, find.next()
                        // substringSearch
                    ];
                case 1:
                    result = _a.sent();
                    return [3 /*break*/, 4];
                case 2:
                    if (!(query.method === 'substringSearch')) return [3 /*break*/, 4];
                    search = '';
                    if (query.search != null && typeof query.search === 'string') {
                        search = query.search;
                    }
                    regex = new RegExp(escapeRegex(search), 'gi');
                    $match = {};
                    $match[field] = regex;
                    $project = void 0;
                    if (query.result === 'fullObjects') {
                        $project = {
                            _id: false
                        };
                    }
                    else if (query.result === 'dynamicSelect') {
                        $project = {
                            _id: false,
                            ref: true,
                            name: "$" + field
                        };
                    }
                    find = collection.aggregate([{ $match: $match }, { $project: $project }]);
                    return [4 /*yield*/, find.toArray()];
                case 3:
                    result = _a.sent();
                    _a.label = 4;
                case 4:
                    res.json(result);
                    return [3 /*break*/, 6];
                case 5:
                    error_1 = _a.sent();
                    next(error_1);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    }); });
    /* get */
    app.get('/get/folder-title-tree', function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b, error_2;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 2, , 3]);
                    _b = (_a = res).json;
                    return [4 /*yield*/, exports.database.getFolderTitleTree()];
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
        var _a, _b, error_3;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 2, , 3]);
                    _b = (_a = res).json;
                    return [4 /*yield*/, exports.database.flushMediaFiles()];
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
    app.get('/mgmt/init', function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b, error_4;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 2, , 3]);
                    _b = (_a = res).json;
                    return [4 /*yield*/, exports.database.initialize()];
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
    app.get('/mgmt/open', function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var query, archive, create, ref, type, _a, _b, _c, _d, error_5;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    _e.trys.push([0, 5, , 6]);
                    query = req.query;
                    if (query.ref == null) {
                        throw new Error('You have to specify an ID (?ref=myfile).');
                    }
                    if (query.with == null)
                        query.with = 'editor';
                    if (query.type == null)
                        query.type = 'presentations';
                    archive = 'archive' in query;
                    create = 'create' in query;
                    ref = extractString(query, 'ref');
                    type = operations_1.validateMediaType(extractString(query, 'type'));
                    if (!(query.with === 'editor')) return [3 /*break*/, 2];
                    _b = (_a = res).json;
                    return [4 /*yield*/, operations_1.openEditor(ref, type)];
                case 1:
                    _b.apply(_a, [_e.sent()]);
                    return [3 /*break*/, 4];
                case 2:
                    if (!(query.with === 'folder')) return [3 /*break*/, 4];
                    _d = (_c = res).json;
                    return [4 /*yield*/, operations_1.openParentFolder(ref, type, archive, create)];
                case 3:
                    _d.apply(_c, [_e.sent()]);
                    _e.label = 4;
                case 4: return [3 /*break*/, 6];
                case 5:
                    error_5 = _e.sent();
                    next(error_5);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    }); });
    app.get('/mgmt/re-init', function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b, error_6;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 2, , 3]);
                    _b = (_a = res).json;
                    return [4 /*yield*/, exports.database.reInitialize()];
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
    app.get('/mgmt/update', function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b, error_7;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 2, , 3]);
                    _b = (_a = res).json;
                    return [4 /*yield*/, update(false)];
                case 1:
                    _b.apply(_a, [_c.sent()]);
                    // Clear error message store.
                    errors = [];
                    return [3 /*break*/, 3];
                case 2:
                    error_7 = _c.sent();
                    next(error_7);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    /* stats = statistics */
    app.get('/stats/count', function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b, error_8;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 2, , 3]);
                    _b = (_a = res).json;
                    return [4 /*yield*/, exports.database.getDocumentCounts()];
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
    app.get('/stats/updates', function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b, error_9;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 2, , 3]);
                    _b = (_a = res).json;
                    return [4 /*yield*/, exports.database.listUpdateTasks()];
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
    return app;
}
/**
 * Run the REST API. Listen to a TCP port.
 *
 * @param port - A TCP port.
 */
function runRestApi(port) {
    return __awaiter(this, void 0, void 0, function () {
        var app, mongoClient, helpMessages, usedPort;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    app = express_1.default();
                    return [4 /*yield*/, mongodb_connector_1.connectDb()];
                case 1:
                    mongoClient = _a.sent();
                    exports.database = new mongodb_connector_1.Database(mongoClient.db());
                    return [4 /*yield*/, exports.database.initialize()];
                case 2:
                    _a.sent();
                    app.use(cors_1.default());
                    app.use(express_1.default.json());
                    app.use('/seating-plan', seating_plan_1.registerSeatingPlan(exports.database));
                    app.use('/media', registerMediaRestApi());
                    helpMessages = {};
                    app.get('/', function (req, res) {
                        res.json({
                            navigation: {
                                media: helpMessages.navigation
                            }
                        });
                    });
                    if (port == null) {
                        usedPort = config.api.port;
                    }
                    else {
                        usedPort = port;
                    }
                    app.listen(usedPort, function () {
                        console.log("The BALDR REST API is running on port " + usedPort + ".");
                    });
                    return [2 /*return*/, app];
            }
        });
    });
}
var main = function () {
    return __awaiter(this, void 0, void 0, function () {
        var port;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (process.argv.length === 3)
                        port = parseInt(process.argv[2]);
                    return [4 /*yield*/, runRestApi(port)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
};
if (require.main === module) {
    main()
        .then()
        .catch(function (reason) { return console.log(reason); });
}
