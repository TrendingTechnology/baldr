import chalk from 'chalk';
export var red = chalk.red;
export var green = chalk.green;
export var yellow = chalk.yellow;
export var blue = chalk.blue;
export var magenta = chalk.magenta;
export var cyan = chalk.cyan;
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
