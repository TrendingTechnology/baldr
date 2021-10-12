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
exports.renameByRef = exports.renameMediaAsset = exports.readAssetYaml = exports.moveAsset = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const core_browser_1 = require("@bldr/core-browser");
const media_categories_1 = require("@bldr/media-categories");
const file_reader_writer_1 = require("@bldr/file-reader-writer");
const main_1 = require("./main");
const location_indicator_1 = require("./location-indicator");
const log = __importStar(require("@bldr/log"));
function move(oldPath, newPath, { copy, dryRun }) {
    if (oldPath === newPath) {
        return;
    }
    if (copy != null && copy) {
        if (!(dryRun != null && dryRun)) {
            log.debug('Copy file from %s to %s', oldPath, newPath);
            fs_1.default.copyFileSync(oldPath, newPath);
        }
    }
    else {
        if (!(dryRun != null && dryRun)) {
            //  Error: EXDEV: cross-device link not permitted,
            try {
                log.debug('Move file from %s to %s', oldPath, newPath);
                fs_1.default.renameSync(oldPath, newPath);
            }
            catch (error) {
                const e = error;
                if (e.code === 'EXDEV') {
                    log.debug('Move file by copying and deleting from %s to %s', oldPath, newPath);
                    fs_1.default.copyFileSync(oldPath, newPath);
                    fs_1.default.unlinkSync(oldPath);
                }
            }
        }
    }
}
/**
 *
 * @param oldParentPath - The old path of the parent media file.
 * @param newParentPath - The new path of the parent media file.
 * @param search - A regular expression the search for a substring that gets replaced by the replaces.
 * @param replaces - An array of replace strings.
 * @param opts
 */
function moveCorrespondingFiles(oldParentPath, newParentPath, search, replaces, opts) {
    for (const replace of replaces) {
        const oldCorrespondingPath = oldParentPath.replace(search, replace);
        if (fs_1.default.existsSync(oldCorrespondingPath)) {
            const newCorrespondingPath = newParentPath.replace(search, replace);
            log.debug('Move corresponding file from %s to %s', oldCorrespondingPath, newCorrespondingPath);
            move(oldCorrespondingPath, newCorrespondingPath, opts);
        }
    }
}
/**
 * Move (rename) or copy a media asset and it’s corresponding meta data file
 * (`*.yml`) and preview file (`_preview.jpg`).
 *
 * @param oldPath - The old path of a media asset.
 * @param newPath - The new path of a media asset.
 * @param opts - Some options
 *
 * @returns The new path.
 */
function moveAsset(oldPath, newPath, opts = {}) {
    if (newPath != null && oldPath !== newPath) {
        if (!(opts.dryRun != null && opts.dryRun)) {
            fs_1.default.mkdirSync(path_1.default.dirname(newPath), { recursive: true });
        }
        const extension = (0, core_browser_1.getExtension)(oldPath);
        if (extension === 'eps' || extension === 'svg') {
            // Dippermouth-Blues.eps
            // Dippermouth-Blues.mscx
            // Dippermouth-Blues-eps-converted-to.pdf
            moveCorrespondingFiles(oldPath, newPath, /\.(eps|svg)$/, ['.mscx', '-eps-converted-to.pdf', '.eps', '.svg'], opts);
        }
        // Beethoven.mp4
        // Beethoven.mp4.yml
        // Beethoven.mp4_preview.jpg
        // Beethoven.mp4_waveform.png
        for (const suffix of ['.yml', '_preview.jpg', '_waveform.png']) {
            if (fs_1.default.existsSync(`${oldPath}${suffix}`)) {
                move(`${oldPath}${suffix}`, `${newPath}${suffix}`, opts);
            }
        }
        move(oldPath, newPath, opts);
        return newPath;
    }
}
exports.moveAsset = moveAsset;
/**
 * Read the corresponding YAML file of a media asset.
 *
 * @param filePath - The path of the media asset (without the
 *   extension `.yml`).
 */
function readAssetYaml(filePath) {
    const extension = (0, core_browser_1.getExtension)(filePath);
    if (extension !== 'yml') {
        filePath = `${filePath}.yml`;
    }
    if (fs_1.default.existsSync(filePath)) {
        return (0, file_reader_writer_1.readYamlFile)(filePath);
    }
}
exports.readAssetYaml = readAssetYaml;
/**
 * Rename a media asset and its meta data files.
 *
 * @param oldPath - The media file path.
 *
 * @returns The new file name.
 */
function renameMediaAsset(oldPath) {
    const metaData = readAssetYaml(oldPath);
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
    moveAsset(oldPath, newPath);
    return newPath;
}
exports.renameMediaAsset = renameMediaAsset;
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
        log.info('Rename the file %s by reference from %s to %s', filePath, oldBaseName, ref);
        newPath = path_1.default.join(path_1.default.dirname(oldPath), `${ref}${extension}`);
        moveAsset(oldPath, newPath);
    }
}
exports.renameByRef = renameByRef;
