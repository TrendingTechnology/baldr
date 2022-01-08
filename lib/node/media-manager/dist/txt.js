/**
 * Manipulate text based media (e. g. svg) files.
 *
 * @module @bldr/media-manager/txt
 */
import { readFile, writeFile } from '@bldr/file-reader-writer';
export function removeWidthHeightInSvg(filePath) {
    let content = readFile(filePath);
    content = content.replace(/<svg.*?>/is, function (substring) {
        substring = substring.replace(/\n*\s*(height|width)\s*=\s*".*?"/gi, '');
        return substring;
    });
    writeFile(filePath, content);
}
/**
 * Delete spaces at the end.
 */
export function removeSpacesAtLineEnd(input) {
    return input.replace(/[ \t]+\n/g, '\n');
}
/**
 * Fix some typographic issues.
 */
export function fixTypography(filePath) {
    let content = readFile(filePath);
    const before = content;
    content = removeSpacesAtLineEnd(content);
    // Delete multiple empty lines
    content = content.replace(/\n\n\n+/g, '\n\n');
    // One newline at the end
    content = content.replace(/(.)\n*$/g, '$1\n');
    const after = content;
    if (before !== after) {
        writeFile(filePath, content);
    }
}
