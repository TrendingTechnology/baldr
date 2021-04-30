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
    if (result.ref != null) {
        let ref = result.ref;
        const oldPath = filePath;
        // .mp4
        const extension = path_1.default.extname(oldPath);
        const oldBaseName = path_1.default.basename(oldPath, extension);
        let newPath = null;
        // Gregorianik_HB_Alleluia-Ostermesse -> Alleluia-Ostermesse
        ref = ref.replace(/.*_[A-Z]{2,}_/, '');
        console.log(ref);
        if (ref !== oldBaseName) {
            newPath = path_1.default.join(path_1.default.dirname(oldPath), `${ref}${extension}`);
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
    return __awaiter(this, void 0, void 0, function* () {
        yield media_manager_1.walk({
            asset(relPath) {
                if (fs_1.default.existsSync(`${relPath}.yml`)) {
                    renameFromIdOneFile(relPath);
                }
            }
        }, {
            path: files
        });
    });
}
module.exports = action;
