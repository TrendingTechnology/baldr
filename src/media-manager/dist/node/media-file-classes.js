"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.filePathToAssetType = exports.mediaCategoriesManager = exports.makeAsset = exports.Asset = void 0;
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
        return path_1.default.basename(this.absPath, `.${this.extension}`);
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
        if (data) {
            this.metaData = data;
        }
    }
    /**
     * The id of the media asset. Read from the metadata file.
     */
    get id() {
        if (this.metaData && this.metaData.id) {
            return this.metaData.id;
        }
    }
    /**
     * The media category (`image`, `audio`, `video`, `document`)
     */
    get mediaCategory() {
        if (this.extension) {
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
    if (asset.extension)
        return exports.mediaCategoriesManager.extensionToType(asset.extension);
}
exports.filePathToAssetType = filePathToAssetType;
