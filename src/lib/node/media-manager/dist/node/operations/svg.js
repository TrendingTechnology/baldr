"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeWidthHeightInSvg = void 0;
const file_reader_writer_1 = require("@bldr/file-reader-writer");
function removeWidthHeightInSvg(filePath) {
    let content = (0, file_reader_writer_1.readFile)(filePath);
    content = content.replace(/<svg.*?>/si, function (substring) {
        substring = substring.replace(/\s*(height|width)\s*=\s*".*?"\s*\n*/ig, ' ');
        substring = substring.replace(/  +/g, ' ');
        return substring;
    });
    (0, file_reader_writer_1.writeFile)(filePath, content);
}
exports.removeWidthHeightInSvg = removeWidthHeightInSvg;
