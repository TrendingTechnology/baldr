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
// Node packages.
var child_process_1 = __importDefault(require("child_process"));
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
// Project packages.
var config_1 = __importDefault(require("@bldr/config"));
var media_manager_1 = require("@bldr/media-manager");
var main_1 = require("./main");
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
                    return [4 /*yield*/, main_1.database.db.collection(mediaType).find({ id: id }).next()];
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
                    return [2 /*return*/, path_1.default.join(config_1.default.mediaServer.basePath, relPath)];
            }
        });
    });
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
    if (create && !fs_1.default.existsSync(currentPath)) {
        fs_1.default.mkdirSync(currentPath, { recursive: true });
        result.create = true;
    }
    if (fs_1.default.existsSync(currentPath)) {
        // xdg-open opens a mounted root folder in vs code.
        openWith(config_1.default.mediaServer.fileManager, currentPath);
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
    var relPath = media_manager_1.locationIndicator.getRelPath(currentPath);
    for (var _i = 0, _a = media_manager_1.locationIndicator.get(); _i < _a.length; _i++) {
        var basePath = _a[_i];
        if (relPath) {
            var currentPath_1 = path_1.default.join(basePath, relPath);
            result[currentPath_1] = openFolder(currentPath_1, create);
        }
        else {
            result[basePath] = openFolder(basePath, create);
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
        var files = fs_1.default.readdirSync(dir);
        filelist = filelist || [];
        files.forEach(function (file) {
            var filePath = path_1.default.join(dir, file);
            if (fs_1.default.statSync(filePath).isDirectory() && file.match(/^\d\d_/)) {
                filelist.push(filePath);
                walkSync(filePath, filelist);
            }
        });
        return filelist;
    }
    var currentBasePath = media_manager_1.locationIndicator.getBasePath(currentPath);
    var mirrorBasePath;
    for (var _i = 0, _a = media_manager_1.locationIndicator.get(); _i < _a.length; _i++) {
        var basePath = _a[_i];
        if (basePath !== currentBasePath) {
            mirrorBasePath = basePath;
            break;
        }
    }
    var relPaths = walkSync(currentPath);
    for (var index = 0; index < relPaths.length; index++) {
        relPaths[index] = media_manager_1.locationIndicator.getRelPath(relPaths[index]);
    }
    var created = [];
    var existing = [];
    for (var _b = 0, relPaths_1 = relPaths; _b < relPaths_1.length; _b++) {
        var relPath = relPaths_1[_b];
        var newPath = path_1.default.join(mirrorBasePath, relPath);
        if (!fs_1.default.existsSync(newPath)) {
            try {
                fs_1.default.mkdirSync(newPath, { recursive: true });
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
 * @param executable - Name or path of an executable.
 * @param filePath - The path of a file or a folder.
 *
 * @see node module on npmjs.org “open”
 * @see {@link https://unix.stackexchange.com/a/537848}
 */
function openWith(executable, filePath) {
    // See node module on npmjs.org “open”
    var subprocess = child_process_1.default.spawn(executable, [filePath], {
        stdio: 'ignore',
        detached: true
    });
    subprocess.unref();
}
/**
 * Open a media file specified by an ID with an editor specified in
 *   `config.mediaServer.editor` (`/etc/baldr.json`).
 *
 * @param id - The id of the media type.
 * @param mediaType - At the moment `assets` and `presentation`
 */
function openEditor(id, mediaType) {
    return __awaiter(this, void 0, void 0, function () {
        var absPath, parentFolder, editor;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getAbsPathFromId(id, mediaType)];
                case 1:
                    absPath = _a.sent();
                    parentFolder = path_1.default.dirname(absPath);
                    editor = config_1.default.mediaServer.editor;
                    if (!fs_1.default.existsSync(editor)) {
                        return [2 /*return*/, {
                                error: "Editor \u201C" + editor + "\u201D can\u2019t be found."
                            }];
                    }
                    openWith(config_1.default.mediaServer.editor, parentFolder);
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
 * @param id - The id of the media type.
 * @param mediaType - At the moment `assets` and `presentation`
 * @param archive - Addtionaly open the corresponding archive
 *   folder.
 * @param create - Create the directory structure of
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
                    parentFolder = path_1.default.dirname(absPath);
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
