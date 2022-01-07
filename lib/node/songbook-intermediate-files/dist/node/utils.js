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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFiles = exports.listFiles = exports.parseSongIDList = void 0;
const fs = __importStar(require("fs-extra"));
const path = __importStar(require("path"));
function parseSongIDList(listPath) {
    const content = fs.readFileSync(listPath, { encoding: 'utf-8' });
    return content.split(/\s+/).filter(songId => songId);
}
exports.parseSongIDList = parseSongIDList;
/**
 * List files in a folder. You have to use a filter string to select the files.
 * The resulting array of file names is sorted.
 *
 * @param folderPath - The path of the directory.
 * @param regExp - A regular expression to filter, e. g. “\.eps$”.
 *
 * @return An array of file names.
 */
function listFiles(folderPath, regExp) {
    if (fs.existsSync(folderPath)) {
        return fs
            .readdirSync(folderPath)
            .filter(file => {
            return file.match(regExp);
        })
            .sort(undefined);
    }
    return [];
}
exports.listFiles = listFiles;
/**
 * Delete all files matching a filter string in a specified folder.
 *
 * @param folderPath - The path of the folder.
 * @param regExp - A regular expression to filter, e. g. “.eps”.
 */
function deleteFiles(folderPath, regExp) {
    const oldFiles = listFiles(folderPath, regExp);
    for (const oldFile of oldFiles) {
        fs.unlinkSync(path.join(folderPath, oldFile));
    }
}
exports.deleteFiles = deleteFiles;
