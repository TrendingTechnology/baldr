"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTex = exports.isPresentation = exports.isAsset = exports.filePathToMimeType = exports.makeAsset = exports.Asset = void 0;
// Node packages.
const path_1 = __importDefault(require("path"));
const string_format_1 = require("@bldr/string-format");
const client_media_models_1 = require("@bldr/client-media-models");
const asset_1 = require("./asset");
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
        return (0, string_format_1.getExtension)(this.absPath);
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
        const data = (0, asset_1.readAssetYaml)(this.absPath);
        if (data != null) {
            this.metaData = data;
        }
    }
    /**
     * The reference of the media asset. Read from the metadata file.
     */
    get ref() {
        var _a;
        if (((_a = this.metaData) === null || _a === void 0 ? void 0 : _a.ref) != null) {
            return this.metaData.ref;
        }
    }
    /**
     * The media category (`image`, `audio`, `video`, `document`)
     */
    get mediaCategory() {
        if (this.extension != null) {
            return client_media_models_1.mimeTypeManager.extensionToType(this.extension);
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
/**
 * @param filePath - The file path of the media asset.
 */
function filePathToMimeType(filePath) {
    const asset = makeAsset(filePath);
    if (asset.extension != null) {
        return client_media_models_1.mimeTypeManager.extensionToType(asset.extension);
    }
}
exports.filePathToMimeType = filePathToMimeType;
/**
 * Check if the given file is a media asset.
 *
 * @param filePath - The path of the file to check.
 */
function isAsset(filePath) {
    if (filePath.includes('eps-converted-to.pdf') || // eps converted into pdf by TeX
        filePath.includes('_preview.jpg') || // Preview image
        filePath.includes('_waveform.png') || // Preview image
        filePath.match(/_no\d+\./) != null // Multipart asset
    ) {
        return false;
    }
    // see .gitignore of media folder
    if (filePath.match(/^.*\/(TX|PT|QL)\/.*.pdf$/) != null) {
        return true;
    }
    return client_media_models_1.mimeTypeManager.isAsset(filePath);
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
/**
 * Check if the given file is a TeX file.
 *
 * @param filePath - The path of the file to check.
 */
function isTex(filePath) {
    if (filePath.match(/\.tex$/) != null) {
        return true;
    }
    return false;
}
exports.isTex = isTex;
