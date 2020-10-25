"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Asset = void 0;
// Node packages.
const path_1 = __importDefault(require("path"));
const core_browser_1 = require("@bldr/core-browser");
const main_1 = require("./main");
/**
 * Base class for the asset and presentation class.
 */
class MediaFile {
    /**
     * @param {string} filePath - The file path of the media file.
     */
    constructor(filePath) {
        this.absPath = path_1.default.resolve(filePath);
    }
    /**
     * The file extension of the media file.
     */
    get extension() {
        return core_browser_1.getExtension(this.absPath);
    }
    /**
     * The basename (filename without extension) of the file.
     */
    get basename() {
        return path_1.default.basename(this.absPath, `.${this.extension}`);
    }
}
/**
 * A media asset.
 */
class Asset extends MediaFile {
    /**
     * @param {string} filePath - The file path of the media asset.
     */
    constructor(filePath) {
        super(filePath);
        const data = main_1.readAssetYaml(this.absPath);
        if (data) {
            this.metaData = data;
        }
    }
}
exports.Asset = Asset;
