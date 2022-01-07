"use strict";
/**
 * Treat strings as if they were file paths.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExtension = exports.formatMultiPartAssetFileName = void 0;
/**
 * Generate the n-th file name or the URL from a file name or a URL of the first
 * element of a multipart asset. The parameter `firstFileName` must have a
 * extension (for example `.jpg`). The parameter `no` must be less then 1000.
 * Only tree digit or smaller integers are allowed.
 *
 * 1. `multipart-asset.jpg`
 * 2. `multipart-asset_no002.jpg`
 * 3. `multipart-asset_no003.jpg`
 * 4. ...
 *
 * @param firstFileName - A file name, a path or a URL.
 * @param no - The number in the multipart asset list. The first element has the
 *   number 1.
 *
 * @return The possibly changed file name, file path or URL with the suffix `_noXXX`.
 *
 * @throws if no is greater than 999.
 * @throws if no is no integer.
 * @throws if firstFileName includes no extension.
 */
function formatMultiPartAssetFileName(firstFileName, no) {
    if (!Number.isInteger(no)) {
        throw new Error(`${firstFileName}: The argument “no” has to be an integer, not “${no}”!`);
    }
    if (no > 999) {
        throw new Error(`${firstFileName}: The multipart asset number must not be greater than 999, got the number “${no}”!`);
    }
    if (!firstFileName.includes('.')) {
        throw new Error(`${firstFileName}: The multipart asset file name must contain a file extension.`);
    }
    let suffix;
    if (no === 1) {
        return firstFileName;
    }
    else if (no < 10) {
        suffix = `_no00${no}`;
    }
    else if (no < 100) {
        suffix = `_no0${no}`;
    }
    else {
        suffix = `_no${no}`;
    }
    return firstFileName.replace(/(\.\w+$)/, `${suffix}$1`);
}
exports.formatMultiPartAssetFileName = formatMultiPartAssetFileName;
/**
 * Get the extension from a file path.
 *
 * @param filePath - A file path or a single file name.
 *
 * @returns The file extension in lower case.
 *
 * @throws Throws an exception if not file extension can be found.
 */
function getExtension(filePath) {
    const extension = filePath.split('.').pop();
    if (!filePath.includes('.') || extension == null) {
        throw new Error(`The given file path “${filePath}” has no file extension!`);
    }
    return extension.toLowerCase();
}
exports.getExtension = getExtension;
