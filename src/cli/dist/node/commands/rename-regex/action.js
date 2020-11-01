"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
// Node packages.
const fs_1 = __importDefault(require("fs"));
// Third party packages.
const chalk_1 = __importDefault(require("chalk"));
// Project packages.
const media_manager_1 = require("@bldr/media-manager");
/**
 * @param {String} filePath - The media file path.
 *
 * @returns {String}
 */
function renameByRegex(filePath, { pattern, replacement }) {
    const newFilePath = filePath.replace(pattern, replacement);
    if (filePath !== newFilePath) {
        console.log(`\nRename:\n  old: ${chalk_1.default.yellow(filePath)} \n  new: ${chalk_1.default.green(newFilePath)}`);
        fs_1.default.renameSync(filePath, newFilePath);
    }
}
function action(pattern, replacement, filePath) {
    media_manager_1.walk(renameByRegex, {
        regex: new RegExp('.*'),
        path: filePath,
        payload: { pattern, replacement }
    });
}
module.exports = action;
