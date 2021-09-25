"use strict";
/**
 * Manage the media files in the media server directory (create,
 * normalize metadata files, rename media files, normalize the
 * presentation content file).
 *
 * @module @bldr/media-manager
 */
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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readAssetYaml = exports.moveAsset = exports.setLogLevel = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const core_browser_1 = require("@bldr/core-browser");
const file_reader_writer_1 = require("@bldr/file-reader-writer");
const log = __importStar(require("@bldr/log"));
__exportStar(require("./operations"), exports);
__exportStar(require("./directory-tree-walk"), exports);
__exportStar(require("./location-indicator"), exports);
__exportStar(require("./media-file-classes"), exports);
__exportStar(require("./yaml"), exports);
function setLogLevel(level) {
    log.setLogLevel(level);
}
exports.setLogLevel = setLogLevel;
/**
 * Move (rename) or copy a media asset and it’s corresponding meta data file
 * (`*.yml`) and preview file (`_preview.jpg`).
 *
 * @param oldPath - The old path of a media asset.
 * @param newPath - The new path of a media asset.
 * @param opts - Some options
 */
function moveAsset(oldPath, newPath, opts = {}) {
    function move(oldPath, newPath, { copy, dryRun }) {
        if (copy != null && copy) {
            if (!(dryRun != null && dryRun)) {
                fs_1.default.copyFileSync(oldPath, newPath);
            }
        }
        else {
            if (!(dryRun != null && dryRun)) {
                //  Error: EXDEV: cross-device link not permitted,
                try {
                    fs_1.default.renameSync(oldPath, newPath);
                }
                catch (error) {
                    const e = error;
                    if (e.code === 'EXDEV') {
                        fs_1.default.copyFileSync(oldPath, newPath);
                        fs_1.default.unlinkSync(oldPath);
                    }
                }
            }
        }
    }
    function moveCorrespondingFile(oldPath, newPath, search, replace, opts) {
        oldPath = oldPath.replace(search, replace);
        if (fs_1.default.existsSync(oldPath)) {
            newPath = newPath.replace(search, replace);
            move(oldPath, newPath, opts);
        }
    }
    if (newPath != null && oldPath !== newPath) {
        if (!(opts.dryRun != null && opts.dryRun)) {
            fs_1.default.mkdirSync(path_1.default.dirname(newPath), { recursive: true });
        }
        const extension = (0, core_browser_1.getExtension)(oldPath);
        if (extension === 'eps') {
            // Dippermouth-Blues.eps
            // Dippermouth-Blues.mscx
            moveCorrespondingFile(oldPath, newPath, /\.eps$/, '.mscx', opts);
            // Dippermouth-Blues-eps-converted-to.pdf
            moveCorrespondingFile(oldPath, newPath, /\.eps$/, '-eps-converted-to.pdf', opts);
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
    if (extension !== 'yml')
        filePath = `${filePath}.yml`;
    if (fs_1.default.existsSync(filePath)) {
        return (0, file_reader_writer_1.readYamlFile)(filePath);
    }
}
exports.readAssetYaml = readAssetYaml;
