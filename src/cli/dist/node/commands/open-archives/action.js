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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
// Node packages.
const path_1 = __importDefault(require("path"));
// Project packages.
const media_manager_1 = require("@bldr/media-manager");
const media_server_1 = require("@bldr/rest-api");
const log = __importStar(require("@bldr/log"));
/**
 * Create a relative path in different base paths. Open this relative paths in
 * the file manager.
 *
 * @param filePaths - An array of input files. This parameter comes from
 *   the commanders’ variadic parameter `[files...]`.
 * @param cmdObj - An object containing options as key-value pairs.
 *  This parameter comes from `commander.Command.opts()`
 */
function action(filePath, cmdObj) {
    if (filePath == null) {
        filePath = process.cwd();
    }
    const regex = /^[a-zA-Z0-9-_./]+$/g;
    if (!regex.test(filePath)) {
        log.info('The current working directory “%s” contains illegal characters.', [filePath]);
        return;
    }
    filePath = path_1.default.resolve(filePath);
    const presParentDir = media_manager_1.locationIndicator.getPresParentDir(filePath);
    if (presParentDir != null && filePath !== presParentDir) {
        filePath = presParentDir;
        log.info('Open parent folder instead');
    }
    (0, media_server_1.openArchivesInFileManager)(filePath, cmdObj.createDirs);
}
module.exports = action;
