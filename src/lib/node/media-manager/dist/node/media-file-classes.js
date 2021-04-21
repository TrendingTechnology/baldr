"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPresentation = exports.isAsset = exports.filePathToAssetType = exports.mediaCategoriesManager = exports.makeAsset = exports.Asset = void 0;
// Node packages.
const path_1 = __importDefault(require("path"));
const core_browser_1 = require("@bldr/core-browser");
const config_1 = __importDefault(require("@bldr/config"));
const main_1 = require("./main");
/**
 * Base class for the asset and presentation class.
 */
class MediaFile {
    /**
     * @param filePath - The file path of the media file.
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
        if (this.extension != null) {
            return path_1.default.basename(this.absPath, `.${this.extension}`);
        }
        return this.absPath;
    }
}
/**
 * A media asset.
 */
class Asset extends MediaFile {
    /**
     * @param filePath - The file path of the media asset.
     */
    constructor(filePath) {
        super(filePath);
        const data = main_1.readAssetYaml(this.absPath);
        if (data != null) {
            this.metaData = data;
        }
    }
    /**
     * The id of the media asset. Read from the metadata file.
     */
    get id() {
        var _a;
        if (((_a = this.metaData) === null || _a === void 0 ? void 0 : _a.id) != null) {
            return this.metaData.id;
        }
    }
    /**
     * The media category (`image`, `audio`, `video`, `document`)
     */
    get mediaCategory() {
        if (this.extension != null) {
            return exports.mediaCategoriesManager.extensionToType(this.extension);
        }
    }
}
exports.Asset = Asset;
/**
 * Make a media asset from a file path.
 *
 * @param filePath - The file path of the media asset.
 */
function makeAsset(filePath) {
    return new Asset(filePath);
}
exports.makeAsset = makeAsset;
exports.mediaCategoriesManager = new core_browser_1.MediaCategoriesManager(config_1.default);
/**
 * @param filePath - The file path of the media asset.
 */
function filePathToAssetType(filePath) {
    const asset = makeAsset(filePath);
    if (asset.extension != null) {
        return exports.mediaCategoriesManager.extensionToType(asset.extension);
    }
}
exports.filePathToAssetType = filePathToAssetType;
/**
 * Check if the given file is a media asset.
 *
 * @param filePath - The path of the file to check.
 */
function isAsset(filePath) {
    if (filePath.includes('eps-converted-to.pdf') || // eps converted into pdf by TeX
        filePath.includes('_preview.jpg') || // Preview image
        (filePath.match(/_no\d+\./) != null) // Multipart asset
    ) {
        return false;
    }
    // see .gitignore of media folder
    if (filePath.match(new RegExp('^.*/(TX|PT|QL)/.*.pdf$')) != null)
        return true;
    return exports.mediaCategoriesManager.isAsset(filePath);
}
exports.isAsset = isAsset;
/**
 * Check if the given file is a presentation.
 *
 * @param filePath - The path of the file to check.
 */
function isPresentation(filePath) {
    if (filePath.includes('Praesentation.baldr.yml')) {
        return true;
    }
    return false;
}
exports.isPresentation = isPresentation;
