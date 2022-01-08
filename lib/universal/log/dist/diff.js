import { createTwoFilesPatch } from 'diff';
import chalk from 'chalk';
var red = chalk.red, green = chalk.green;
export function colorizeDiff(oldString, newString) {
    var output = [];
    var patch = createTwoFilesPatch('old', 'new', oldString, newString);
    var lines = patch.split(/(\n|\r\n)/);
    for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
        var line = lines_1[_i];
        var formattedLine = void 0;
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
