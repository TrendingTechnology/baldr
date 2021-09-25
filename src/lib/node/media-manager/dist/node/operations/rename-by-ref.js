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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.renameByRef = void 0;
// Node packages.
const path_1 = __importDefault(require("path"));
const media_categories_1 = require("@bldr/media-categories");
const log = __importStar(require("@bldr/log"));
// Project packages.
const main_1 = require("../main");
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
        if (ref === oldBaseName) {
            return;
        }
        log.info('Rename by reference from %s to %s', oldBaseName, ref);
        newPath = path_1.default.join(path_1.default.dirname(oldPath), `${ref}${extension}`);
        (0, main_1.moveAsset)(oldPath, newPath);
    }
}
exports.renameByRef = renameByRef;
