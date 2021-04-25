"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.green = exports.yellow = exports.red = void 0;
const chalk = require("chalk");
function red(input) {
    return chalk.red(input);
}
exports.red = red;
function yellow(input) {
    return chalk.yellow(input);
}
exports.yellow = yellow;
function green(input) {
    return chalk.green(input);
}
exports.green = green;
