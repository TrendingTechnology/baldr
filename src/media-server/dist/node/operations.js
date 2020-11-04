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
exports.openParentFolder = exports.openEditor = exports.validateMediaType = void 0;
// Node packages.
const child_process_1 = __importDefault(require("child_process"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// Project packages.
const config_1 = __importDefault(require("@bldr/config"));
const media_manager_1 = require("@bldr/media-manager");
const main_1 = require("./main");
/**
 * Throw an error if the media type is unkown. Provide a default value.
 *
 * @param mediaType - At the moment `assets` and `presentation`
 */
function validateMediaType(mediaType) {
    const mediaTypes = ['assets', 'presentations'];
    if (!mediaType)
        return 'assets';
    if (!mediaTypes.includes(mediaType)) {
        throw new Error(`Unkown media type “${mediaType}”! Allowed media types are: ${mediaTypes}`);
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
 * @param id - The id of the media type.
 * @param mediaType - At the moment `assets` and `presentation`
 */
function getAbsPathFromId(id, mediaType = 'presentations') {
    return __awaiter(this, void 0, void 0, function* () {
        mediaType = validateMediaType(mediaType);
        const result = yield main_1.database.db.collection(mediaType).find({ id: id }).next();
        if (!result)
            throw new Error(`Can not find media file with the type “${mediaType}” and the id “${id}”.`);
        let relPath;
        if (mediaType === 'assets') {
            relPath = `${result.path}.yml`;
        }
        else {
            relPath = result.path;
        }
        return path_1.default.join(config_1.default.mediaServer.basePath, relPath);
    });
}
/**
 * Open a file path using the linux command `xdg-open`.
 *
 * @param currentPath
 * @param create - Create the directory structure of
 *   the given `currentPath` in a recursive manner.
 */
function openFolder(currentPath, create) {
    const result = {};
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
    const result = {};
    const relPath = media_manager_1.locationIndicator.getRelPath(currentPath);
    for (const basePath of media_manager_1.locationIndicator.get()) {
        if (relPath) {
            const currentPath = path_1.default.join(basePath, relPath);
            result[currentPath] = openFolder(currentPath, create);
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
    function walkSync(dir, fileList) {
        const files = fs_1.default.readdirSync(dir);
        if (!fileList)
            fileList = [];
        files.forEach(function (file) {
            const filePath = path_1.default.join(dir, file);
            if (fs_1.default.statSync(filePath).isDirectory() && file.match(/^\d\d_/)) {
                if (fileList)
                    fileList.push(filePath);
                walkSync(filePath, fileList);
            }
        });
        return fileList;
    }
    const currentBasePath = media_manager_1.locationIndicator.getBasePath(currentPath);
    let mirrorBasePath = '';
    for (const basePath of media_manager_1.locationIndicator.get()) {
        if (basePath !== currentBasePath) {
            mirrorBasePath = basePath;
            break;
        }
    }
    const relPaths = walkSync(currentPath);
    for (let index = 0; index < relPaths.length; index++) {
        relPaths[index] = media_manager_1.locationIndicator.getRelPath(relPaths[index]);
    }
    const created = [];
    const existing = [];
    for (const relPath of relPaths) {
        const newPath = path_1.default.join(mirrorBasePath, relPath);
        if (!fs_1.default.existsSync(newPath)) {
            try {
                fs_1.default.mkdirSync(newPath, { recursive: true });
            }
            catch (error) {
                return {
                    error
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
            currentBasePath,
            mirrorBasePath,
            created,
            existing
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
    const subprocess = child_process_1.default.spawn(executable, [filePath], {
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
    return __awaiter(this, void 0, void 0, function* () {
        const absPath = yield getAbsPathFromId(id, mediaType);
        const parentFolder = path_1.default.dirname(absPath);
        const editor = config_1.default.mediaServer.editor;
        if (!fs_1.default.existsSync(editor)) {
            return {
                error: `Editor “${editor}” can’t be found.`
            };
        }
        openWith(config_1.default.mediaServer.editor, parentFolder);
        return {
            id,
            mediaType,
            absPath,
            parentFolder,
            editor
        };
    });
}
exports.openEditor = openEditor;
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
    return __awaiter(this, void 0, void 0, function* () {
        const absPath = yield getAbsPathFromId(id, mediaType);
        const parentFolder = path_1.default.dirname(absPath);
        let result;
        if (archive) {
            result = openFolderWithArchives(parentFolder, create);
        }
        else {
            result = openFolder(parentFolder, create);
        }
        return {
            id,
            parentFolder,
            mediaType,
            archive,
            create,
            result
        };
    });
}
exports.openParentFolder = openParentFolder;
