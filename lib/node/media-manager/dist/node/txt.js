"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fixTypography = exports.removeSpacesAtLineEnd = exports.removeWidthHeightInSvg = void 0;
/**
 * Manipulate text based media (e. g. svg) files.
 *
 * @module @bldr/media-manager/txt
 */
const file_reader_writer_1 = require("@bldr/file-reader-writer");
function removeWidthHeightInSvg(filePath) {
    let content = (0, file_reader_writer_1.readFile)(filePath);
    content = content.replace(/<svg.*?>/is, function (substring) {
        substring = substring.replace(/\n*\s*(height|width)\s*=\s*".*?"/gi, '');
        return substring;
    });
    (0, file_reader_writer_1.writeFile)(filePath, content);
}
exports.removeWidthHeightInSvg = removeWidthHeightInSvg;
/**
 * Delete spaces at the end.
 */
function removeSpacesAtLineEnd(input) {
    return input.replace(/[ \t]+\n/g, '\n');
}
exports.removeSpacesAtLineEnd = removeSpacesAtLineEnd;
/**
 * Fix some typographic issues.
 */
function fixTypography(filePath) {
    let content = (0, file_reader_writer_1.readFile)(filePath);
    const before = content;
    content = removeSpacesAtLineEnd(content);
    // Delete multiple empty lines
    content = content.replace(/\n\n\n+/g, '\n\n');
    // One newline at the end
    content = content.replace(/(.)\n*$/g, '$1\n');
    const after = content;
    if (before !== after) {
        (0, file_reader_writer_1.writeFile)(filePath, content);
    }
}
exports.fixTypography = fixTypography;
