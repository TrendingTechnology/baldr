"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.renameMediaAsset = void 0;
const path_1 = __importDefault(require("path"));
const core_browser_1 = require("@bldr/core-browser");
const media_categories_1 = require("@bldr/media-categories");
const main_1 = require("../main");
/**
 * Rename a media asset and its meta data files.
 *
 * @param oldPath - The media file path.
 *
 * @returns The new file name.
 */
function renameMediaAsset(oldPath) {
    const metaData = (0, main_1.readAssetYaml)(oldPath);
    let newPath;
    if ((metaData === null || metaData === void 0 ? void 0 : metaData.categories) != null) {
        metaData.extension = (0, core_browser_1.getExtension)(oldPath);
        metaData.filePath = oldPath;
        const data = metaData;
        newPath = media_categories_1.categoriesManagement.formatFilePath(data, oldPath);
    }
    if (newPath == null) {
        newPath = (0, core_browser_1.asciify)(oldPath);
    }
    const basename = path_1.default.basename(newPath);
    // Remove a- and v- prefixes
    const cleanedBasename = basename.replace(/^[va]-/g, '');
    if (cleanedBasename !== basename) {
        newPath = path_1.default.join(path_1.default.dirname(newPath), cleanedBasename);
    }
    (0, main_1.moveAsset)(oldPath, newPath);
    return newPath;
}
exports.renameMediaAsset = renameMediaAsset;
