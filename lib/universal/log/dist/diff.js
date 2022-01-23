import { createTwoFilesPatch } from 'diff';
import chalk from 'chalk';
const { red, green } = chalk;
export function colorizeDiff(oldString, newString) {
    const output = [];
    let patch = createTwoFilesPatch('old', 'new', oldString, newString);
    patch = patch.replace(/^=+(\n|\r\n)/, '');
    patch = patch.replace(/--- old(\n|\r\n)?/, '');
    patch = patch.replace(/\+\+\+ new(\n|\r\n)?/, '');
    patch = patch.replace(/\\ No newline at end of file(\n|\r\n)?/, '');
    const lines = patch.split(/(\n|\r\n)/);
    for (const line of lines) {
        let formattedLine;
        if (line.charAt(0) === '+') {
            formattedLine = green(line);
        }
        else if (line.charAt(0) === '-') {
            formattedLine = red(line);
        }
        else {
            formattedLine = line;
        }
        output.push(formattedLine);
    }
    return output.join('');
}
