"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Node packages.
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// Project packages.
const media_manager_1 = require("@bldr/media-manager");
/**
 * Rename a media asset after the `id` in the meta data file.
 *
 * @param filePath - The media asset file path.
 */
function renameFromIdOneFile(filePath) {
    let result;
    try {
        result = media_manager_1.loadMetaDataYaml(filePath);
    }
    catch (error) {
        console.log(filePath);
        console.log(error);
        return;
    }
    if (result.id) {
        let id = result.id;
        const oldPath = filePath;
        // .mp4
        const extension = path_1.default.extname(oldPath);
        const oldBaseName = path_1.default.basename(oldPath, extension);
        let newPath = null;
        // Gregorianik_HB_Alleluia-Ostermesse -> Alleluia-Ostermesse
        id = id.replace(/.*_[A-Z]{2,}_/, '');
        console.log(id);
        if (id !== oldBaseName) {
            newPath = path_1.default.join(path_1.default.dirname(oldPath), `${id}${extension}`);
        }
        else {
            return;
        }
        media_manager_1.moveAsset(oldPath, newPath);
    }
}
/**
 * Rename a media asset or all child asset of the parent working directory
 * after the `id` in the meta data file.
 *
 * @param files - An array of input files, comes from the commanders’
 *   variadic parameter `[files...]`.
 */
function action(files) {
    media_manager_1.walk({
        asset(relPath) {
            if (fs_1.default.existsSync(`${relPath}.yml`)) {
                renameFromIdOneFile(relPath);
            }
        }
    }, {
        path: files
    });
}
module.exports = action;
