"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getColorFunction = exports.cyan = exports.magenta = exports.blue = exports.yellow = exports.green = exports.red = void 0;
const chalk = require("chalk");
var chalk_1 = require("chalk");
Object.defineProperty(exports, "red", { enumerable: true, get: function () { return chalk_1.red; } });
Object.defineProperty(exports, "green", { enumerable: true, get: function () { return chalk_1.green; } });
Object.defineProperty(exports, "yellow", { enumerable: true, get: function () { return chalk_1.yellow; } });
Object.defineProperty(exports, "blue", { enumerable: true, get: function () { return chalk_1.blue; } });
Object.defineProperty(exports, "magenta", { enumerable: true, get: function () { return chalk_1.magenta; } });
Object.defineProperty(exports, "cyan", { enumerable: true, get: function () { return chalk_1.cyan; } });
function getColorFunction(colorName) {
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
exports.getColorFunction = getColorFunction;
