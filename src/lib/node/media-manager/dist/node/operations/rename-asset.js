"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.renameMediaAsset = void 0;
const path_1 = __importDefault(require("path"));
const core_browser_1 = require("@bldr/core-browser");
const media_categories_1 = require("@bldr/media-categories");
const core_browser_2 = require("@bldr/core-browser");
const main_1 = require("../main");
/**
 * Rename a media asset and its meta data files.
 *
 * @param oldPath - The media file path.
 *
 * @returns The new file name.
 */
function renameMediaAsset(oldPath) {
    const metaData = main_1.readAssetYaml(oldPath);
    let newPath;
    if (metaData && metaData.categories) {
        metaData.extension = core_browser_1.getExtension(oldPath);
        newPath = media_categories_1.categoriesManagement.formatFilePath(metaData, oldPath);
    }
    if (!newPath)
        newPath = core_browser_2.asciify(oldPath);
    const basename = path_1.default.basename(newPath);
    // Remove a- and v- prefixes
    const cleanedBasename = basename.replace(/^[va]-/g, '');
    if (cleanedBasename !== basename) {
        newPath = path_1.default.join(path_1.default.dirname(newPath), cleanedBasename);
    }
    main_1.moveAsset(oldPath, newPath);
    return newPath;
}
exports.renameMediaAsset = renameMediaAsset;
