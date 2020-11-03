#! /usr/bin/env node
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
// Node packages.
var childProcess = require('child_process');
var fs = require('fs');
var path = require('path');
var os = require('os');
// Third party packages.
var cors = require('cors');
var express = require('express');
var yaml = require('js-yaml');
// Project packages.
var config = require('@bldr/config');
var _a = require('@bldr/core-browser'), MediaCategoriesManager = _a.MediaCategoriesManager, convertPropertiesSnakeToCamel = _a.convertPropertiesSnakeToCamel;
var registerSeatingPlan = require('./seating-plan.js').registerRestApi;
// Submodules.
var Database = require('./database.js').Database;
var _b = require('@bldr/media-manager'), walk = _b.walk, asciify = _b.asciify, deasciify = _b.deasciify, metaTypes = _b.metaTypes, TitleTree = _b.TitleTree, DeepTitle = _b.DeepTitle, locationIndicator = _b.locationIndicator;
var packageJson = require('../package.json');
/**
 * Base path of the media server file store.
 */
var basePath = config.mediaServer.basePath;
/**
 * A container array for all error messages send out via the REST API.
 */
var errors = [];
/**
 * @type {module:@bldr/media-server/database.Database}
 */
var database;
/* Helper functions ***********************************************************/
/**
 * Get the extension from a file path.
 *
 * @param {String} filePath
 *
 * @returns {String}
 */
function getExtension(filePath) {
    return path.extname(filePath).replace('.', '');
}
/**
 * Strip HTML tags from a string.
 *
 * @param {String} text - A text containing HTML tags.
 *
 * @returns {String}
 */
function stripTags(text) {
    return text.replace(/<[^>]+>/g, '');
}
/* Media objects **************************************************************/
var folderTitleTree = new TitleTree();
var mediaCategoriesManager = new MediaCategoriesManager(config);
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
        this.absPath_ = path.resolve(filePath);
        /**
         * Relative path ot the file.
         * @type {string}
         */
        this.path = filePath.replace(basePath, '').replace(/^\//, '');
        /**
         * The basename (filename) of the file.
         * @type {string}
         */
        this.filename = path.basename(filePath);
    }
    /**
     * @access protected
     */
    MediaFile.prototype.addFileInfos_ = function () {
        var stats = fs.statSync(this.absPath_);
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
        this.extension = getExtension(this.absPath_);
        /**
         * The basename (filename without extension) of the file.
         * @type {string}
         * @private
         */
        this.basename_ = path.basename(this.absPath_, "." + this.extension);
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
        if (fs.existsSync(filePath)) {
            return yaml.safeLoad(fs.readFileSync(filePath, 'utf8'));
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
            properties = convertPropertiesSnakeToCamel(properties);
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
            this.id = asciify(this.basename_);
        if (!this.title)
            this.title = deasciify(this.id);
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
        if (fs.existsSync(previewImage)) {
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
        while (fs.existsSync(nextAssetFileName(count)) || fs.existsSync(nextAssetFileNameOld(count))) {
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
        var folderTitles = new DeepTitle(filePath);
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
        _this.title = stripTags(_this.meta.title);
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
            return this.title + " (" + stripTags(this.meta.subtitle) + ")";
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
        return stripTags(all);
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
                        if (!fs.existsSync(filePath + ".yml"))
                            return [2 /*return*/];
                        object = new Asset(filePath);
                    }
                    object = object.prepareForInsert();
                    return [4 /*yield*/, database.db.collection(mediaType).insertOne(object)];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    console.log(error_1);
                    relPath = filePath.replace(config.mediaServer.basePath, '');
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
    var gitPull = childProcess.spawnSync('git', ['pull'], {
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
                    gitRevParse = childProcess.spawnSync('git', ['rev-parse', 'HEAD'], {
                        cwd: basePath,
                        encoding: 'utf-8'
                    });
                    lastCommitId = gitRevParse.stdout.replace(/\n$/, '');
                    return [4 /*yield*/, database.connect()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, database.initialize()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, database.flushMediaFiles()];
                case 3:
                    _a.sent();
                    begin = new Date().getTime();
                    return [4 /*yield*/, database.db.collection('updates').insertOne({ begin: begin, end: 0 })];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, walk({
                            everyFile: function (filePath) {
                                // Delete temporary files.
                                if (filePath.match(/\.(aux|out|log|synctex\.gz|mscx,)$/) ||
                                    filePath.indexOf('Praesentation_tmp.baldr.yml') > -1 ||
                                    filePath.indexOf('title_tmp.txt') > -1) {
                                    fs.unlinkSync(filePath);
                                }
                            },
                            directory: function (filePath) {
                                // Delete empty directories.
                                if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
                                    var files = fs.readdirSync(filePath);
                                    if (files.length === 0) {
                                        fs.rmdirSync(filePath);
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
                    return [4 /*yield*/, database.db.collection('folderTitleTree').deleteOne({ id: 'root' })];
                case 6:
                    // .replaceOne and upsert: Problems with merge objects?
                    _a.sent();
                    return [4 /*yield*/, database.db.collection('folderTitleTree').insertOne({
                            id: 'root',
                            tree: folderTitleTree.get()
                        })];
                case 7:
                    _a.sent();
                    end = new Date().getTime();
                    return [4 /*yield*/, database.db.collection('updates').updateOne({ begin: begin }, { $set: { end: end, lastCommitId: lastCommitId } })];
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
 * Throw an error if the media type is unkown. Provide a default value.
 *
 * @param {String} mediaType - At the moment `assets` and `presentation`
 *
 * @return {String}
 */
function validateMediaType(mediaType) {
    var mediaTypes = ['assets', 'presentations'];
    if (!mediaType)
        return 'assets';
    if (!mediaTypes.includes(mediaType)) {
        throw new Error("Unkown media type \u201C" + mediaType + "\u201D! Allowed media types are: " + mediaTypes);
    }
    else {
        return mediaType;
    }
}
/**
 * Resolve a ID from a given media type (`assets`, `presentations`) to a
 * absolute path.
 *
 * @param {String} id - The id of the media type.
 * @param {String} mediaType - At the moment `assets` and `presentation`
 *
 * @return {Promise.<String>}
 */
function getAbsPathFromId(id, mediaType) {
    if (mediaType === void 0) { mediaType = 'presentations'; }
    return __awaiter(this, void 0, void 0, function () {
        var result, relPath;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mediaType = validateMediaType(mediaType);
                    return [4 /*yield*/, database.db.collection(mediaType).find({ id: id }).next()];
                case 1:
                    result = _a.sent();
                    if (!result)
                        throw new Error("Can not find media file with the type \u201C" + mediaType + "\u201D and the id \u201C" + id + "\u201D.");
                    if (mediaType === 'assets') {
                        relPath = result.path + ".yml";
                    }
                    else {
                        relPath = result.path;
                    }
                    return [2 /*return*/, path.join(config.mediaServer.basePath, relPath)];
            }
        });
    });
}
/**
 *
 * @param {String} filePath
 *
 * @see {@link https://stackoverflow.com/a/36221905/10193818}
 */
function untildify(filePath) {
    if (filePath[0] === '~') {
        return path.join(os.homedir(), filePath.slice(1));
    }
    return filePath;
}
/**
 * Open a file path using the linux command `xdg-open`.
 *
 * @param {String} currentPath
 * @param {Boolean} create - Create the directory structure of
 *   the given `currentPath` in a recursive manner.
 */
function openFolder(currentPath, create) {
    var result = {};
    if (create && !fs.existsSync(currentPath)) {
        fs.mkdirSync(currentPath, { recursive: true });
        result.create = true;
    }
    if (fs.existsSync(currentPath)) {
        // xdg-open opens a mounted root folder in vs code.
        openWith(config.mediaServer.fileManager, currentPath);
        result.open = true;
    }
    return result;
}
/**
 * Open the current path multiple times.
 *
 * 1. In the main media server directory
 * 2. In a archive directory structure.
 * 3. In a second archive directory structure ... and so on.
 *
 * @param {String} currentPath
 * @param {Boolean} create - Create the directory structure of
 *   the given `currentPath` in a recursive manner.
 */
function openFolderWithArchives(currentPath, create) {
    var result = {};
    var relPath = locationIndicator.getRelPath(currentPath);
    for (var _i = 0, _a = locationIndicator.get(); _i < _a.length; _i++) {
        var basePath_1 = _a[_i];
        if (relPath) {
            var currentPath_1 = path.join(basePath_1, relPath);
            result[currentPath_1] = openFolder(currentPath_1, create);
        }
        else {
            result[basePath_1] = openFolder(basePath_1, create);
        }
    }
    return result;
}
/**
 * Mirror the folder structure of the media folder into the archive folder or
 * vice versa. Only folders with two prefixed numbers followed by an
 * underscore (for example “10_”) are mirrored.
 *
 * @param {String} currentPath - Must be a relative path within one of the
 *   folder structures.
 *
 * @returns {Object} - Status informations of the action.
 */
function mirrorFolderStructure(currentPath) {
    function walkSync(dir, filelist) {
        var files = fs.readdirSync(dir);
        filelist = filelist || [];
        files.forEach(function (file) {
            var filePath = path.join(dir, file);
            if (fs.statSync(filePath).isDirectory() && file.match(/^\d\d_/)) {
                filelist.push(filePath);
                walkSync(filePath, filelist);
            }
        });
        return filelist;
    }
    var currentBasePath = locationIndicator.getBasePath(currentPath);
    var mirrorBasePath;
    for (var _i = 0, _a = locationIndicator.get(); _i < _a.length; _i++) {
        var basePath_2 = _a[_i];
        if (basePath_2 !== currentBasePath) {
            mirrorBasePath = basePath_2;
            break;
        }
    }
    var relPaths = walkSync(currentPath);
    for (var index = 0; index < relPaths.length; index++) {
        relPaths[index] = locationIndicator.getRelPath(relPaths[index]);
    }
    var created = [];
    var existing = [];
    for (var _b = 0, relPaths_1 = relPaths; _b < relPaths_1.length; _b++) {
        var relPath = relPaths_1[_b];
        var newPath = path.join(mirrorBasePath, relPath);
        if (!fs.existsSync(newPath)) {
            try {
                fs.mkdirSync(newPath, { recursive: true });
            }
            catch (error) {
                return {
                    error: error
                };
            }
            created.push(relPath);
        }
        else {
            existing.push(relPath);
        }
    }
    return {
        ok: {
            currentBasePath: currentBasePath,
            mirrorBasePath: mirrorBasePath,
            created: created,
            existing: existing
        }
    };
}
/**
 * Open a file path with an executable.
 *
 * To launch apps via the REST API the systemd unit file must run as
 * the user you login in in your desktop environment. You also have to set
 * to environment variables: `DISPLAY=:0` and
 * `DBUS_SESSION_BUS_ADDRESS=unix:path=/run/user/$UID/bus`
 *
 * ```
 * Environment=DISPLAY=:0
 * Environment=DBUS_SESSION_BUS_ADDRESS=unix:path=/run/user/1000/bus
 * User=1000
 * Group=1000
 * ```
 *
 * @param {String} executable - Name or path of an executable.
 * @param {String} filePath - The path of a file or a folder.
 *
 * @see node module on npmjs.org “open”
 * @see {@link https://unix.stackexchange.com/a/537848}
 */
function openWith(executable, filePath) {
    // See node module on npmjs.org “open”
    var subprocess = childProcess.spawn(executable, [filePath], {
        stdio: 'ignore',
        detached: true
    });
    subprocess.unref();
}
/**
 * Open a media file specified by an ID with an editor specified in
 *   `config.mediaServer.editor` (`/etc/baldr.json`).
 *
 * @param {String} id - The id of the media type.
 * @param {String} mediaType - At the moment `assets` and `presentation`
 */
function openEditor(id, mediaType) {
    return __awaiter(this, void 0, void 0, function () {
        var absPath, parentFolder, editor;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getAbsPathFromId(id, mediaType)];
                case 1:
                    absPath = _a.sent();
                    parentFolder = path.dirname(absPath);
                    editor = config.mediaServer.editor;
                    if (!fs.existsSync(editor)) {
                        return [2 /*return*/, {
                                error: "Editor \u201C" + editor + "\u201D can\u2019t be found."
                            }];
                    }
                    openWith(config.mediaServer.editor, parentFolder);
                    return [2 /*return*/, {
                            id: id,
                            mediaType: mediaType,
                            absPath: absPath,
                            parentFolder: parentFolder,
                            editor: editor
                        }];
            }
        });
    });
}
/**
 * Open the parent folder of a presentation, a media asset in a file explorer
 * GUI application.
 *
 * @param {String} id - The id of the media type.
 * @param {String} mediaType - At the moment `assets` and `presentation`
 * @param {Boolean} archive - Addtionaly open the corresponding archive
 *   folder.
 * @param {Boolean} create - Create the directory structure of
 *   the relative path in the archive in a recursive manner.
 */
function openParentFolder(id, mediaType, archive, create) {
    return __awaiter(this, void 0, void 0, function () {
        var absPath, parentFolder, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getAbsPathFromId(id, mediaType)];
                case 1:
                    absPath = _a.sent();
                    parentFolder = path.dirname(absPath);
                    if (archive) {
                        result = openFolderWithArchives(parentFolder, create);
                    }
                    else {
                        result = openFolder(parentFolder, create);
                    }
                    return [2 /*return*/, {
                            id: id,
                            parentFolder: parentFolder,
                            mediaType: mediaType,
                            archive: archive,
                            create: create,
                            result: result
                        }];
            }
        });
    });
}
/**
 * Register the express js rest api in a giant function.
 */
function registerMediaRestApi() {
    var _this = this;
    var db = database.db;
    // https://stackoverflow.com/a/38427476/10193818
    function escapeRegex(text) {
        return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
    }
    var app = express();
    app.get('/', function (req, res) {
        res.json(helpMessages.navigation);
    });
    app.get('/version', function (req, res) {
        res.json({
            name: packageJson.name,
            version: packageJson.version
        });
    });
    /* query */
    app.get('/query', function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var query, methods, collection, result, find, findObject, regex, $match, $project, error_2;
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
                    query.type = validateMediaType(query.type.toString());
                    methods = ['exactMatch', 'substringSearch'];
                    if (!('method' in query))
                        query.method = 'substringSearch';
                    if (!methods.includes(query.method.toString())) {
                        throw new Error("Unkown method \u201C" + query.method + "\u201D! Allowed methods: " + methods);
                    }
                    // field
                    if (!('field' in query))
                        query.field = 'id';
                    // result
                    if (!('result' in query))
                        query.result = 'fullObjects';
                    return [4 /*yield*/, database.connect()];
                case 1:
                    _a.sent();
                    collection = db.collection(query.type);
                    result = void 0;
                    find = void 0;
                    if (!(query.method === 'exactMatch')) return [3 /*break*/, 3];
                    findObject = {};
                    findObject[query.field] = query.search;
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
                    $match[query.field] = regex;
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
                    return [4 /*yield*/, database.flushMediaFiles()];
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
                    return [4 /*yield*/, database.initialize()];
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
                    return [4 /*yield*/, openEditor(query.id.toString(), query.type.toString())];
                case 1:
                    _b.apply(_a, [_e.sent()]);
                    return [3 /*break*/, 4];
                case 2:
                    if (!(query.with === 'folder')) return [3 /*break*/, 4];
                    _d = (_c = res).json;
                    return [4 /*yield*/, openParentFolder(query.id.toString(), query.type.toString(), archive, create)];
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
                    return [4 /*yield*/, database.reInitialize()];
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
                    app = express();
                    database = new Database();
                    return [4 /*yield*/, database.connect()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, database.initialize()];
                case 2:
                    _a.sent();
                    app.use(cors());
                    app.use(express.json());
                    app.use('/seating-plan', registerSeatingPlan(database));
                    app.use('/media', registerMediaRestApi());
                    helpMessages = {
                        version: {
                            name: packageJson.name,
                            version: packageJson.version
                        }
                    };
                    app.get('/', function (req, res) {
                        res.json({
                            version: packageJson.version,
                            navigation: {
                                media: helpMessages.navigation
                            }
                        });
                    });
                    app.get('/version', function (req, res) {
                        res.json(helpMessages.version);
                    });
                    if (!port) {
                        port = config.api.port;
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
module.exports = {
    asciify: asciify,
    Asset: Asset,
    mediaCategoriesManager: mediaCategoriesManager,
    deasciify: deasciify,
    TitleTree: TitleTree,
    getExtension: getExtension,
    helpMessages: helpMessages,
    DeepTitle: DeepTitle,
    metaTypes: metaTypes,
    mirrorFolderStructure: mirrorFolderStructure,
    openFolderWithArchives: openFolderWithArchives,
    openWith: openWith,
    registerMediaRestApi: registerMediaRestApi,
    runRestApi: runRestApi
};
