"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.colorizeDiff = void 0;
const diff_1 = require("diff");
const chalk_1 = require("chalk");
function colorizeDiff(oldString, newString) {
    const output = [];
    const patch = (0, diff_1.createTwoFilesPatch)('old', 'new', oldString, newString);
    const lines = patch.split(/(\n|\r\n)/);
    for (const line of lines) {
        let formattedLine;
        if (line.charAt(0) === '+') {
            formattedLine = (0, chalk_1.green)(line);
        }
        else if (line.charAt(0) === '-') {
            formattedLine = (0, chalk_1.red)(line);
        }
        else {
            formattedLine = line;
        }
        output.push(formattedLine);
    }
    return output.join('');
}
exports.colorizeDiff = colorizeDiff;
