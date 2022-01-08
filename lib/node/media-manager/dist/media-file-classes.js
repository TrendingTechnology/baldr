import { mimeTypeManager } from '@bldr/client-media-models';
/**
 * Check if the given file is a media asset.
 *
 * @param filePath - The path of the file to check.
 */
export function isAsset(filePath) {
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
    return mimeTypeManager.isAsset(filePath);
}
/**
 * Check if the given file is a presentation.
 *
 * @param filePath - The path of the file to check.
 */
export function isPresentation(filePath) {
    if (filePath.includes('Praesentation.baldr.yml')) {
        return true;
    }
    return false;
}
/**
 * Check if the given file is a TeX file.
 *
 * @param filePath - The path of the file to check.
 */
export function isTex(filePath) {
    if (filePath.match(/\.tex$/) != null) {
        return true;
    }
    return false;
}
