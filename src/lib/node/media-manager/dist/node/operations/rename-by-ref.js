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
const log = __importStar(require("@bldr/log"));
// Project packages.
const main_1 = require("../main");
const location_indicator_1 = require("../location-indicator");
/**
 * Rename a media asset after the `ref` (reference) property in the metadata file.
 *
 * @param filePath - The media asset file path.
 */
function renameByRef(filePath) {
    let result;
    try {
        result = (0, main_1.readYamlMetaData)(filePath);
    }
    catch (error) {
        log.error(error);
        return;
    }
    if (result.ref != null) {
        let ref = result.ref;
        const oldPath = filePath;
        const refs = location_indicator_1.locationIndicator.getRefOfSegments(filePath);
        // 10_Ausstellung-Ueberblick/NB/01_Gnom.svg.yml
        // ref: Ausstellung-Ueberblick_NB_01_Gnom
        // -> 01_Gnom
        // 10_Ausstellung-Ueberblick/YT/sPg1qlLjUVQ.mp4.yml
        // ref: YT_sPg1qlLjUVQ
        // -> sPg1qlLjUVQ
        if (refs != null) {
            for (const pathRef of refs) {
                ref = ref.replace(new RegExp(`^${pathRef}_`), '');
            }
        }
        // Old approach:
        // ref = ref.replace(new RegExp('.*_' + getTwoLetterRegExp() + '_'), '')
        // .mp4
        const extension = path_1.default.extname(oldPath);
        const oldBaseName = path_1.default.basename(oldPath, extension);
        let newPath = null;
        if (ref === oldBaseName) {
            return;
        }
        log.info('Rename by reference from %s to %s', oldBaseName, ref);
        newPath = path_1.default.join(path_1.default.dirname(oldPath), `${ref}${extension}`);
        (0, main_1.moveAsset)(oldPath, newPath);
    }
}
exports.renameByRef = renameByRef;
