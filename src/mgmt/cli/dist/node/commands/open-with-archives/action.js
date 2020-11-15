"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Node packages.
const path_1 = __importDefault(require("path"));
// Third party packages.
const chalk_1 = __importDefault(require("chalk"));
// Project packages:
const media_manager_1 = require("@bldr/media-manager");
const media_server_1 = require("@bldr/media-server");
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
    if (!filePath) {
        filePath = process.cwd();
    }
    const regex = /^[a-zA-Z0-9-_/]+$/g;
    if (!regex.test(filePath)) {
        console.log(`The current working directory “${chalk_1.default.red(filePath)}” contains illegal characters.`);
        return;
    }
    filePath = path_1.default.resolve(filePath);
    const presParentDir = media_manager_1.locationIndicator.getPresParentDir(filePath);
    if (filePath !== presParentDir) {
        filePath = presParentDir;
        console.log(chalk_1.default.red('Open parent folder instead'));
    }
    console.log(media_server_1.openWithFileManagerWithArchives(filePath, cmdObj.createDirs));
}
module.exports = action;
