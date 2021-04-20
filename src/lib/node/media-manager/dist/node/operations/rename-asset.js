"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.renameMediaAsset = void 0;
const path_1 = __importDefault(require("path"));
const core_browser_1 = require("@bldr/core-browser");
const media_categories_management_1 = __importDefault(require("../media-categories-management"));
const helper_1 = require("../helper");
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
    if (metaData && metaData.metaTypes) {
        metaData.extension = core_browser_1.getExtension(oldPath);
        newPath = media_categories_management_1.default.formatFilePath(metaData, oldPath);
    }
    if (!newPath)
        newPath = helper_1.asciify(oldPath);
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
