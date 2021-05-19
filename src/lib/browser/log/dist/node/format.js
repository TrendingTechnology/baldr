"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectFormatTemplate = exports.format = exports.formatWithoutColor = exports.colorize = void 0;
const fast_printf_1 = require("fast-printf");
const color = require("./color");
exports.colorize = color;
// eslint-disable-next-line no-control-regex
const ansiRegexp = /\u001b\[.*?m/;
function formatWithoutColor(template, ...args) {
    if (typeof template === 'number') {
        template = template.toString();
    }
    return fast_printf_1.printf(template, ...args);
}
exports.formatWithoutColor = formatWithoutColor;
function format(template, ...args) {
    args = args.map(value => {
        if (typeof value !== 'string' || (typeof value === 'string' && (value === null || value === void 0 ? void 0 : value.match(ansiRegexp)) != null)) {
            return value;
        }
        return color.yellow(value);
    });
    return formatWithoutColor(template, ...args);
}
exports.format = format;
function detectFormatTemplate(...msg) {
    const args = [...arguments];
    const firstArg = arguments[0];
    if (typeof firstArg === 'number' || typeof firstArg === 'string') {
        return [format(firstArg, ...args.slice(1))];
    }
    return args;
}
exports.detectFormatTemplate = detectFormatTemplate;
