"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTex = exports.isPresentation = exports.isAsset = void 0;
const client_media_models_1 = require("@bldr/client-media-models");
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
