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
// Node packages.
const child_process_1 = __importDefault(require("child_process"));
const fs_1 = __importDefault(require("fs"));
// Project packages.
const config_ng_1 = require("@bldr/config");
const config = config_ng_1.getConfig();
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
}
exports.openWith = openWith;
/**
 * Open a file path using using the in `config.mediaServer.fileManager`
 * specified file manager.
 *
 * @param currentPath - The current path that should be opened in the file
 *   manager.
 * @param create - Create the directory structure of the given `currentPath` in
 *   a recursive manner.
 */
function openInFileManager(currentPath, create) {
    const result = {};
    if (create && !fs_1.default.existsSync(currentPath)) {
        fs_1.default.mkdirSync(currentPath, { recursive: true });
        result.create = true;
    }
    if (fs_1.default.existsSync(currentPath)) {
        // xdg-open opens a mounted root folder in vs code.
        openWith(config.mediaServer.fileManager, currentPath);
        result.open = true;
    }
    return result;
}
exports.openInFileManager = openInFileManager;
