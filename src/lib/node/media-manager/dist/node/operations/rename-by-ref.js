"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.renameAllInPresDirByRef = exports.renameByRef = void 0;
// Node packages.
const path_1 = __importDefault(require("path"));
// Project packages.
const main_1 = require("../main");
const media_categories_1 = require("@bldr/media-categories");
const directory_tree_walk_1 = require("../directory-tree-walk");
const location_indicator_1 = require("../location-indicator");
/**
 * Rename a media asset after the `ref` in the meta data file.
 *
 * @param filePath - The media asset file path.
 */
function renameByRef(filePath) {
    let result;
    try {
        result = (0, main_1.readYamlMetaData)(filePath);
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
        ref = ref.replace(new RegExp('.*_' + (0, media_categories_1.getTwoLetterRegExp)() + '_'), '');
        if (ref !== oldBaseName) {
            newPath = path_1.default.join(path_1.default.dirname(oldPath), `${ref}${extension}`);
        }
        else {
            return;
        }
        (0, main_1.moveAsset)(oldPath, newPath);
    }
}
exports.renameByRef = renameByRef;
/**
 * Rename all files which are in the same parent presentation folder
 * as the specified file path.
 *
 * @param filePath - All files which are in the same parent presentation folder
 *   as this file path are renamed.
 */
function renameAllInPresDirByRef(filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        const parentDir = location_indicator_1.locationIndicator.getPresParentDir(filePath);
        if (parentDir == null) {
            return;
        }
        yield (0, directory_tree_walk_1.walk)({
            everyFile(filePath) {
                renameByRef(filePath);
            }
        }, { path: parentDir });
    });
}
exports.renameAllInPresDirByRef = renameAllInPresDirByRef;
