"use strict";
/**
 * Open files and path in the shell, the file manager etc (using child_process.spawn)
 *
 * @module @bldr/open-with
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.openInFileManager = exports.openWith = void 0;
const child_process_1 = __importDefault(require("child_process"));
const fs_1 = __importDefault(require("fs"));
// Project packages.
const config_1 = require("@bldr/config");
const path_1 = __importDefault(require("path"));
const config = (0, config_1.getConfig)();
/**
 * Open a file path with an executable.
 *
 * To launch apps via the REST API the systemd unit file must run as
 * the user you logged in to your desktop environment. You also have to set
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
    return subprocess;
}
exports.openWith = openWith;
/**
 * Open one file path with the in `config.mediaServer.fileManager`
 * specified file manager.
 *
 * @param filePath - The file path that should be opened in the file manager.
 * @param createParentDir - Create the directory structure of the given
 *   `filePath` in a recursive manner.
 */
function openSinglePathInFileManager(filePath, createParentDir = false) {
    let createdParentDir = false;
    let opened = false;
    let process;
    if (createParentDir && !fs_1.default.existsSync(filePath)) {
        fs_1.default.mkdirSync(filePath, { recursive: true });
        createdParentDir = true;
    }
    const stat = fs_1.default.statSync(filePath);
    const parentDir = stat.isDirectory() ? filePath : path_1.default.dirname(filePath);
    if (fs_1.default.existsSync(parentDir)) {
        // xdg-open opens a mounted root folder in vs code.
        process = openWith(config.mediaServer.fileManager, parentDir);
        opened = true;
    }
    return {
        fileManager: config.mediaServer.fileManager,
        filePath,
        parentDir,
        opened,
        createdParentDir,
        process
    };
}
/**
 * Open a file path or multiple file paths with the in
 * `config.mediaServer.fileManager` specified file manager.
 *
 * @param filePaths - The file paths that should be opened in the file manager.
 * @param createParentDir - Create the directory structure of the given
 *   `filePath` in a recursive manner.
 */
function openInFileManager(filePaths, createParentDir = false) {
    const results = [];
    if (!Array.isArray(filePaths)) {
        filePaths = [filePaths];
    }
    for (const filePath of filePaths) {
        results.push(openSinglePathInFileManager(filePath, createParentDir));
    }
    return results;
}
exports.openInFileManager = openInFileManager;
