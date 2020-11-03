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
 *       - `id`: The ID of the media file (required).
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
 *      - `field`: `id` (default), `title`, etc ... (where).
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
exports.database = void 0;
// Node packages.
var child_process_1 = __importDefault(require("child_process"));
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
// Third party packages.
var cors_1 = __importDefault(require("cors"));
var express_1 = __importDefault(require("express"));
var js_yaml_1 = __importDefault(require("js-yaml"));
// Project packages.
var config_1 = __importDefault(require("@bldr/config"));
var core_browser_1 = require("@bldr/core-browser");
var media_manager_1 = require("@bldr/media-manager");
// Submodules.
var database_js_1 = require("./database.js");
var seating_plan_1 = require("./seating-plan");
var operations_1 = require("./operations");
/**
 * Base path of the media server file store.
 */
var basePath = config_1.default.mediaServer.basePath;
/**
 * A container array for all error messages send out via the REST API.
 */
var errors = [];
/* Media objects **************************************************************/
var folderTitleTree = new media_manager_1.TitleTree(new media_manager_1.DeepTitle(config_1.default.mediaServer.basePath));
var mediaCategoriesManager = new core_browser_1.MediaCategoriesManager(config_1.default);
/**
 * Base class to be extended.
 */
var MediaFile = /** @class */ (function () {
    function MediaFile(filePath) {
        /**
         * Absolute path ot the file.
         * @type {string}
         * @access protected
         */
        this.absPath_ = path_1.default.resolve(filePath);
        /**
         * Relative path ot the file.
         * @type {string}
         */
        this.path = filePath.replace(basePath, '').replace(/^\//, '');
        /**
         * The basename (filename) of the file.
         * @type {string}
         */
        this.filename = path_1.default.basename(filePath);
    }
    /**
     * @access protected
     */
    MediaFile.prototype.addFileInfos_ = function () {
        var stats = fs_1.default.statSync(this.absPath_);
        /**
         * The file size in bytes.
         * @type {number}
         */
        this.size = stats.size;
        /**
         * The timestamp indicating the last time this file was modified
         * expressed in milliseconds since the POSIX Epoch.
         * @type {Number}
         */
        this.timeModified = stats.mtimeMs;
        /**
         * The extension of the file.
         * @type {string}
         */
        this.extension = core_browser_1.getExtension(this.absPath_);
        /**
         * The basename (filename without extension) of the file.
         * @type {string}
         * @private
         */
        this.basename_ = path_1.default.basename(this.absPath_, "." + this.extension);
        return this;
    };
    /**
     * Parse the info file of a media asset or the presenation file itself.
     *
     * Each media file can have a info file that stores additional
     * metadata informations.
     *
     * File path:
     * `/home/baldr/beethoven.jpg`
     *
     * Info file in the YAML file format:
     * `/home/baldr/beethoven.jpg.yml`
     *
     * @param {string} filePath - The path of the YAML file.
     *
     * @returns {object}
     *
     * @access protected
     */
    MediaFile.prototype.readYaml_ = function (filePath) {
        if (fs_1.default.existsSync(filePath)) {
            return js_yaml_1.default.safeLoad(fs_1.default.readFileSync(filePath, 'utf8'));
        }
        return {};
    };
    /**
     * Add metadata from the file system, like file size or timeModifed.
     */
    MediaFile.prototype.addFileInfos = function () {
        return this.addFileInfos_();
    };
    /**
     * Delete the temporary properties of the object. Temporary properties end
     * with `_`.
     */
    MediaFile.prototype.cleanTmpProperties = function () {
        for (var property in this) {
            if (property.match(/_$/)) {
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
     * @param {object} properties - Add an object to the class properties.
     */
    MediaFile.prototype.importProperties = function (properties) {
        if (typeof properties === 'object') {
            properties = core_browser_1.convertPropertiesSnakeToCamel(properties);
            for (var property in properties) {
                this[property] = properties[property];
            }
        }
    };
    /**
     * Prepare the object for the insert into the MongoDB database
     * Generate `id` and `title` if this properties are not present.
     */
    MediaFile.prototype.prepareForInsert = function () {
        this.addFileInfos();
        if (!this.id)
            this.id = media_manager_1.asciify(this.basename_);
        if (!this.title)
            this.title = media_manager_1.deasciify(this.id);
        this.cleanTmpProperties();
        return this;
    };
    return MediaFile;
}());
/**
 * This class is used both for the entries in the MongoDB database as well for
 * the queries.
 */
var Asset = /** @class */ (function (_super) {
    __extends(Asset, _super);
    /**
     * @param {string} filePath - The file path of the media file.
     */
    function Asset(filePath) {
        var _this = _super.call(this, filePath) || this;
        /**
         * The absolute path of the info file in the YAML format. On the absolute
         * media file path `.yml` is appended.
         * @type {string}
         */
        _this.infoFile_ = _this.absPath_ + ".yml";
        var data = _this.readYaml_(_this.infoFile_);
        _this.importProperties(data);
        /**
         * Indicates if the asset has a preview image.
         * @type {Boolean}
         */
        _this.previewImage = false;
        return _this;
    }
    /**
     *
     */
    Asset.prototype.addFileInfos = function () {
        this.addFileInfos_();
        var previewImage = this.absPath_ + "_preview.jpg";
        this.assetType = mediaCategoriesManager.extensionToType(this.extension);
        if (fs_1.default.existsSync(previewImage)) {
            this.previewImage = true;
        }
        this.detectMultiparts_();
        return this;
    };
    /**
     * Search for mutlipart assets. The naming scheme of multipart assets is:
     * `filename.jpg`, `filename_no002.jpg`, `filename_no003.jpg`
     */
    Asset.prototype.detectMultiparts_ = function () {
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
            var basePath = _this.absPath_.replace("." + _this.extension, '');
            var fileName = "" + basePath + suffix + "." + _this.extension;
            return fileName;
        };
        /**
         * For old two digit numbering
         *
         * @todo remove
         * @param {Number} count
         */
        var nextAssetFileNameOld = function (count) {
            var suffix;
            if (count < 10) {
                suffix = "_no0" + count;
            }
            else if (count < 100) {
                suffix = "_no" + count;
            }
            var basePath = _this.absPath_.replace("." + _this.extension, '');
            var fileName = "" + basePath + suffix + "." + _this.extension;
            return fileName;
        };
        var count = 2;
        while (fs_1.default.existsSync(nextAssetFileName(count)) || fs_1.default.existsSync(nextAssetFileNameOld(count))) {
            count += 1;
        }
        count -= 1; // The counter is increased before the file system check.
        if (count > 1) {
            /**
             * The count of parts of a multipart asset.
             *
             * @type {Number}
             */
            this.multiPartCount = count;
        }
    };
    return Asset;
}(MediaFile));
/**
 * The whole presentation YAML file converted to an Javascript object. All
 * properties are in `camelCase`.
 */
var Presentation = /** @class */ (function (_super) {
    __extends(Presentation, _super);
    function Presentation(filePath) {
        var _this = _super.call(this, filePath) || this;
        var data = _this.readYaml_(filePath);
        if (data)
            _this.importProperties(data);
        var folderTitles = new media_manager_1.DeepTitle(filePath);
        folderTitleTree.add(folderTitles);
        if (typeof _this.meta === 'undefined')
            _this.meta = {};
        for (var _i = 0, _a = ['id', 'title', 'subtitle', 'curriculum', 'grade']; _i < _a.length; _i++) {
            var property = _a[_i];
            if (typeof _this.meta[property] === 'undefined')
                _this.meta[property] = folderTitles[property];
        }
        /**
         * The plain text version of `this.meta.title`.
         *
         * @type {String}
         */
        _this.title = core_browser_1.stripTags(_this.meta.title);
        /**
         * The plain text version of `this.meta.title (this.meta.subtitle)`
         *
         * @type {String}
         */
        _this.titleSubtitle = _this.titleSubtitle_();
        /**
       * The plain text version of `folderTitles.allTitles
       * (this.meta.subtitle)`
       *
       * For example:
       *
       * 6. Jahrgangsstufe / Lernbereich 2: Musik - Mensch - Zeit /
       * Johann Sebastian Bach: Musik als Bekenntnis /
       * Johann Sebastian Bachs Reise nach Berlin 1747 (Ricercar a 3)
       *
       * @returns {String}
       * @private
       */
        _this.allTitlesSubtitle = _this.allTitlesSubtitle_(folderTitles);
        /**
         * Value is the same as `meta.id`
         *
         * @type {String}
         */
        _this.id = _this.meta.id;
        return _this;
    }
    /**
     * Generate the plain text version of `this.meta.title (this.meta.subtitle)`
     *
     * @returns {String}
     * @private
     */
    Presentation.prototype.titleSubtitle_ = function () {
        if (this.meta.subtitle) {
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
     *
     * @returns {String}
     * @private
     */
    Presentation.prototype.allTitlesSubtitle_ = function (folderTitles) {
        var all = folderTitles.allTitles;
        if (this.meta.subtitle) {
            all = all + " (" + this.meta.subtitle + ")";
        }
        return core_browser_1.stripTags(all);
    };
    return Presentation;
}(MediaFile));
/* Insert *********************************************************************/
/**
 * @param {String} filePath
 * @param {String} mediaType
 */
function insertObjectIntoDb(filePath, mediaType) {
    return __awaiter(this, void 0, void 0, function () {
        var object, error_1, relPath, msg;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    if (mediaType === 'presentations') {
                        object = new Presentation(filePath);
                    }
                    else if (mediaType === 'assets') {
                        // Now only with meta data yml. Fix problems with PDF lying around.
                        if (!fs_1.default.existsSync(filePath + ".yml"))
                            return [2 /*return*/];
                        object = new Asset(filePath);
                    }
                    object = object.prepareForInsert();
                    return [4 /*yield*/, exports.database.db.collection(mediaType).insertOne(object)];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    console.log(error_1);
                    relPath = filePath.replace(config_1.default.mediaServer.basePath, '');
                    relPath = relPath.replace(new RegExp('^/'), '');
                    msg = relPath + ": [" + error_1.name + "] " + error_1.message;
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
    if (gitPull.status !== 0)
        throw new Error("git pull exits with an non-zero status code.");
}
/**
 * Update the media server.
 *
 * @param {Boolean} full - Update with git pull.
 *
 * @returns {Promise.<Object>}
 */
function update(full) {
    if (full === void 0) { full = false; }
    return __awaiter(this, void 0, void 0, function () {
        var gitRevParse, lastCommitId, begin, end;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (full)
                        gitPull();
                    gitRevParse = child_process_1.default.spawnSync('git', ['rev-parse', 'HEAD'], {
                        cwd: basePath,
                        encoding: 'utf-8'
                    });
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
                                if (filePath.match(/\.(aux|out|log|synctex\.gz|mscx,)$/) ||
                                    filePath.indexOf('Praesentation_tmp.baldr.yml') > -1 ||
                                    filePath.indexOf('title_tmp.txt') > -1) {
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
                            presentation: function (filePath) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, insertObjectIntoDb(filePath, 'presentations')];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            }); }); },
                            asset: function (filePath) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, insertObjectIntoDb(filePath, 'assets')];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            }); }); }
                        }, {
                            path: basePath
                        })
                        // .replaceOne and upsert: Problems with merge objects?
                    ];
                case 5:
                    _a.sent();
                    // .replaceOne and upsert: Problems with merge objects?
                    return [4 /*yield*/, exports.database.db.collection('folderTitleTree').deleteOne({ id: 'root' })];
                case 6:
                    // .replaceOne and upsert: Problems with merge objects?
                    _a.sent();
                    return [4 /*yield*/, exports.database.db.collection('folderTitleTree').insertOne({
                            id: 'root',
                            tree: folderTitleTree.get()
                        })];
                case 7:
                    _a.sent();
                    end = new Date().getTime();
                    return [4 /*yield*/, exports.database.db.collection('updates').updateOne({ begin: begin }, { $set: { end: end, lastCommitId: lastCommitId } })];
                case 8:
                    _a.sent();
                    return [2 /*return*/, {
                            finished: true,
                            begin: begin,
                            end: end,
                            duration: end - begin,
                            lastCommitId: lastCommitId,
                            errors: errors
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
 *
 * @type {Object}
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
                    id: 'The ID of the media file (required).',
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
                '/media/query?type=assets&field=id&method=exactMatch&search=Egmont-Ouverture',
                '/media/query?type=assets&field=uuid&method=exactMatch&search=c64047d2-983d-4009-a35f-02c95534cb53',
                '/media/query?type=presentations&field=id&method=exactMatch&search=Beethoven_Marmotte',
                '/media/query?type=assets&field=path&method=substringSearch&search=35_Bilder-Ausstellung_Ueberblick&result=fullObjects',
                '/media/query?type=assets&field=path&method=substringSearch&search=35_Bilder-Ausstellung_Ueberblick&result=dynamicSelect'
            ],
            '#parameters': {
                type: '`assets` (default), `presentations` (what)',
                method: '`exactMatch`, `substringSearch` (default) (how). `exactMatch`: The query parameter `search` must be a perfect match to a top level database field to get a result. `substringSearch`: The query parameter `search` is only a substring of the string to search in.',
                field: '`id` (default), `title`, etc ... (where).',
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
        var query, methods, field, collection, result, find, findObject, regex, $match, $project, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 6, , 7]);
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
                    // type
                    query.type = operations_1.validateMediaType(query.type.toString());
                    methods = ['exactMatch', 'substringSearch'];
                    if (!('method' in query))
                        query.method = 'substringSearch';
                    if (!methods.includes(query.method.toString())) {
                        throw new Error("Unkown method \u201C" + query.method + "\u201D! Allowed methods: " + methods);
                    }
                    field = !query.field ? 'id' : query.field;
                    // result
                    if (!('result' in query))
                        query.result = 'fullObjects';
                    return [4 /*yield*/, exports.database.connect()];
                case 1:
                    _a.sent();
                    collection = db.collection(query.type);
                    result = void 0;
                    find = void 0;
                    if (!(query.method === 'exactMatch')) return [3 /*break*/, 3];
                    findObject = {};
                    findObject[field] = query.search;
                    find = collection.find(findObject, { projection: { _id: 0 } });
                    return [4 /*yield*/, find.next()
                        // substringSearch
                    ];
                case 2:
                    result = _a.sent();
                    return [3 /*break*/, 5];
                case 3:
                    if (!(query.method === 'substringSearch')) return [3 /*break*/, 5];
                    regex = new RegExp(escapeRegex(query.search), 'gi');
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
                            id: true,
                            name: "$" + query.field
                        };
                    }
                    find = collection.aggregate([{ $match: $match }, { $project: $project }]);
                    return [4 /*yield*/, find.toArray()];
                case 4:
                    result = _a.sent();
                    _a.label = 5;
                case 5:
                    res.json(result);
                    return [3 /*break*/, 7];
                case 6:
                    error_2 = _a.sent();
                    next(error_2);
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    }); });
    /* get */
    app.get('/get/folder-title-tree', function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var result, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, db.collection('folderTitleTree').find({ id: 'root' }, { projection: { _id: 0 } }).next()];
                case 1:
                    result = _a.sent();
                    res.json(result.tree);
                    return [3 /*break*/, 3];
                case 2:
                    error_3 = _a.sent();
                    next(error_3);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    /* mgmt = management */
    app.get('/mgmt/flush', function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b, error_4;
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
                    error_4 = _c.sent();
                    next(error_4);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    app.get('/mgmt/init', function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b, error_5;
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
                    error_5 = _c.sent();
                    next(error_5);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    app.get('/mgmt/open', function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var query, archive, create, _a, _b, _c, _d, error_6;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    _e.trys.push([0, 5, , 6]);
                    query = req.query;
                    if (!query.id)
                        throw new Error('You have to specify an ID (?id=myfile).');
                    if (!query.with)
                        query.with = 'editor';
                    if (!query.type)
                        query.type = 'presentations';
                    archive = ('archive' in query);
                    create = ('create' in query);
                    if (!(query.with === 'editor')) return [3 /*break*/, 2];
                    _b = (_a = res).json;
                    return [4 /*yield*/, operations_1.openEditor(query.id.toString(), query.type.toString())];
                case 1:
                    _b.apply(_a, [_e.sent()]);
                    return [3 /*break*/, 4];
                case 2:
                    if (!(query.with === 'folder')) return [3 /*break*/, 4];
                    _d = (_c = res).json;
                    return [4 /*yield*/, operations_1.openParentFolder(query.id.toString(), query.type.toString(), archive, create)];
                case 3:
                    _d.apply(_c, [_e.sent()]);
                    _e.label = 4;
                case 4: return [3 /*break*/, 6];
                case 5:
                    error_6 = _e.sent();
                    next(error_6);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    }); });
    app.get('/mgmt/re-init', function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b, error_7;
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
                    error_7 = _c.sent();
                    next(error_7);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    app.get('/mgmt/update', function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b, error_8;
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
                    error_8 = _c.sent();
                    next(error_8);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    /* stats = statistics */
    app.get('/stats/count', function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b, error_9;
        var _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _d.trys.push([0, 3, , 4]);
                    _b = (_a = res).json;
                    _c = {};
                    return [4 /*yield*/, db.collection('assets').countDocuments()];
                case 1:
                    _c.assets = _d.sent();
                    return [4 /*yield*/, db.collection('presentations').countDocuments()];
                case 2:
                    _b.apply(_a, [(_c.presentations = _d.sent(),
                            _c)]);
                    return [3 /*break*/, 4];
                case 3:
                    error_9 = _d.sent();
                    next(error_9);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); });
    app.get('/stats/updates', function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b, error_10;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 2, , 3]);
                    _b = (_a = res).json;
                    return [4 /*yield*/, db.collection('updates')
                            .find({}, { projection: { _id: 0 } })
                            .sort({ begin: -1 })
                            .limit(20)
                            .toArray()];
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
    return app;
}
/**
 * Run the REST API. Listen to a TCP port.
 *
 * @param {Number} port - A TCP port.
 */
function runRestApi(port) {
    return __awaiter(this, void 0, void 0, function () {
        var app, helpMessages;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    app = express_1.default();
                    exports.database = new database_js_1.Database();
                    return [4 /*yield*/, exports.database.connect()];
                case 1:
                    _a.sent();
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
                    app.get('/version', function (req, res) {
                        res.json(helpMessages.version);
                    });
                    if (!port) {
                        port = config_1.default.api.port;
                    }
                    app.listen(port, function () {
                        console.log("The BALDR REST API is running on port " + port + ".");
                    });
                    return [2 /*return*/, app];
            }
        });
    });
}
var main = function () {
    var port;
    if (process.argv.length === 3)
        port = parseInt(process.argv[2]);
    return runRestApi(port);
};
// @ts-ignore
if (require.main === module) {
    main();
}
