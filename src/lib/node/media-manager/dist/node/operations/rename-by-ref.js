"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.renameByRef = void 0;
// Node packages.
const path_1 = __importDefault(require("path"));
// Project packages.
const main_1 = require("../main");
/**
 * Rename a media asset after the `id` in the meta data file.
 *
 * @param filePath - The media asset file path.
 */
function renameByRef(filePath) {
    let result;
    try {
        result = main_1.readYamlMetaData(filePath);
    }
    catch (error) {
        return;
    }
    if (result.ref != null) {
        let ref = result.ref;
        const oldPath = filePath;
        // .mp4
        const extension = path_1.default.extname(oldPath);
        const oldBaseName = path_1.default.basename(oldPath, extension);
        let newPath = null;
        // Gregorianik_HB_Alleluia-Ostermesse -> Alleluia-Ostermesse
        ref = ref.replace(/.*_[A-Z]{2,}_/, '');
        if (ref !== oldBaseName) {
            newPath = path_1.default.join(path_1.default.dirname(oldPath), `${ref}${extension}`);
        }
        else {
            return;
        }
        main_1.moveAsset(oldPath, newPath);
    }
}
exports.renameByRef = renameByRef;
