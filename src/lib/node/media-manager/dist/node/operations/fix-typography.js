"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fixTypography = exports.removeSpacesAtLineEnd = void 0;
const file_reader_writer_1 = require("@bldr/file-reader-writer");
/**
 * Delete spaces at the end.
 */
function removeSpacesAtLineEnd(input) {
    // return input.replace(/\s+$/mg, '')
    return input.replace(/\s+\n/g, '\n');
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
