import * as chalk from 'chalk';
export { red, green, yellow, blue, magenta, cyan } from 'chalk';
export function getColorFunction(colorName) {
    switch (colorName) {
        case 'red':
            return chalk.red;
        case 'green':
            return chalk.green;
        case 'yellow':
            return chalk.yellow;
        case 'blue':
            return chalk.blue;
        case 'magenta':
            return chalk.magenta;
        case 'cyan':
            return chalk.cyan;
        case 'none':
        default:
            return function (input) {
                if (typeof input !== 'string') {
                    return String(input);
                }
                return input;
            };
    }
}
