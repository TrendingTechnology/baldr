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
exports.openParentFolder = exports.openEditor = exports.openArchivesInFileManager = exports.validateMediaType = void 0;
// Node packages.
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
// Project packages.
var config_1 = require("@bldr/config");
var media_manager_1 = require("@bldr/media-manager");
var open_with_1 = require("@bldr/open-with");
var rest_api_1 = require("./rest-api");
var config = (0, config_1.getConfig)();
/**
 * Throw an error if the media type is unkown. Provide a default value.
 *
 * @param mediaType - At the moment `assets` and `presentation`
 */
function validateMediaType(mediaType) {
    var mediaTypes = ['assets', 'presentations'];
    if (mediaType == null) {
        return 'assets';
    }
    if (!mediaTypes.includes(mediaType)) {
        throw new Error("Unkown media type \u201C".concat(mediaType, "\u201D! Allowed media types are: ").concat(mediaTypes.join(', ')));
    }
    else {
        return mediaType;
    }
}
exports.validateMediaType = validateMediaType;
/**
 * Resolve a ID from a given media type (`assets`, `presentations`) to a
 * absolute path.
 *
 * @param ref - The ref of the media type.
 * @param mediaType - At the moment `assets` and `presentation`
 */
function getAbsPathFromId(ref, mediaType) {
    if (mediaType === void 0) { mediaType = 'presentations'; }
    return __awaiter(this, void 0, void 0, function () {
        var result, relPath;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mediaType = validateMediaType(mediaType);
                    return [4 /*yield*/, rest_api_1.database.db
                            .collection(mediaType)
                            .find({ ref: ref })
                            .next()];
                case 1:
                    result = _a.sent();
                    if (result.path == null && typeof result.path !== 'string') {
                        throw new Error("Can not find media file with the type \u201C".concat(mediaType, "\u201D and the reference \u201C").concat(ref, "\u201D."));
                    }
                    relPath = result.path;
                    if (mediaType === 'assets') {
                        relPath = "".concat(relPath, ".yml");
                    }
                    return [2 /*return*/, path_1.default.join(config.mediaServer.basePath, relPath)];
            }
        });
    });
}
/**
 * Open the current path multiple times.
 *
 * 1. In the main media server directory
 * 2. In a archive directory structure.
 * 3. In a second archive directory structure ... and so on.
 *
 * @param currentPath
 * @param create - Create the directory structure of
 *   the given `currentPath` in a recursive manner.
 */
function openArchivesInFileManager(currentPath, create) {
    var result = {};
    var relPath = media_manager_1.locationIndicator.getRelPath(currentPath);
    for (var _i = 0, _a = media_manager_1.locationIndicator.basePaths; _i < _a.length; _i++) {
        var basePath = _a[_i];
        if (relPath != null) {
            var currentPath_1 = path_1.default.join(basePath, relPath);
            result[currentPath_1] = (0, open_with_1.openInFileManager)(currentPath_1, create);
        }
        else {
            result[basePath] = (0, open_with_1.openInFileManager)(basePath, create);
        }
    }
    return result;
}
exports.openArchivesInFileManager = openArchivesInFileManager;
/**
 * Open a media file specified by an ID with an editor specified in
 *   `config.mediaServer.editor` (`/etc/baldr.json`).
 *
 * @param ref - The ref of the media type.
 * @param mediaType - At the moment `assets` and `presentation`
 */
function openEditor(ref, mediaType) {
    return __awaiter(this, void 0, void 0, function () {
        var absPath, parentFolder, editor;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getAbsPathFromId(ref, mediaType)];
                case 1:
                    absPath = _a.sent();
                    parentFolder = path_1.default.dirname(absPath);
                    editor = config.mediaServer.editor;
                    if (!fs_1.default.existsSync(editor)) {
                        return [2 /*return*/, {
                                error: "Editor \u201C".concat(editor, "\u201D can\u2019t be found.")
                            }];
                    }
                    (0, open_with_1.openWith)(config.mediaServer.editor, parentFolder);
                    return [2 /*return*/, {
                            ref: ref,
                            mediaType: mediaType,
                            absPath: absPath,
                            parentFolder: parentFolder,
                            editor: editor
                        }];
            }
        });
    });
}
exports.openEditor = openEditor;
/**
 * Open the parent folder of a presentation, a media asset in a file explorer
 * GUI application.
 *
 * @param ref - The ref of the media type.
 * @param mediaType - At the moment `assets` and `presentation`
 * @param archive - Addtionaly open the corresponding archive
 *   folder.
 * @param create - Create the directory structure of
 *   the relative path in the archive in a recursive manner.
 */
function openParentFolder(ref, mediaType, archive, create) {
    return __awaiter(this, void 0, void 0, function () {
        var absPath, parentFolder, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getAbsPathFromId(ref, mediaType)];
                case 1:
                    absPath = _a.sent();
                    parentFolder = path_1.default.dirname(absPath);
                    if (archive) {
                        result = openArchivesInFileManager(parentFolder, create);
                    }
                    else {
                        result = (0, open_with_1.openInFileManager)(parentFolder, create);
                    }
                    return [2 /*return*/, {
                            ref: ref,
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
exports.openParentFolder = openParentFolder;
