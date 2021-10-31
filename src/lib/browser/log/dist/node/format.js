"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatObject = exports.detectFormatTemplate = exports.colorizeFormat = exports.format = exports.formatWithoutColor = void 0;
const fast_printf_1 = require("fast-printf");
const color = require("./color");
// eslint-disable-next-line no-control-regex
const ansiRegexp = /\u001b\[.*?m/;
function formatWithoutColor(template, ...args) {
    if (typeof template === 'number') {
        template = template.toString();
    }
    return fast_printf_1.printf(template, ...args);
}
exports.formatWithoutColor = formatWithoutColor;
function colorizeArgs(args, colorFunction) {
    return args.map(value => {
        if (typeof value === 'number') {
            value = value.toString();
        }
        if (typeof value !== 'string' ||
            (typeof value === 'string' && (value === null || value === void 0 ? void 0 : value.match(ansiRegexp)) != null)) {
            return value;
        }
        return colorFunction(value);
    });
}
function format(template, ...args) {
    args = colorizeArgs(args, color.yellow);
    return formatWithoutColor(template, ...args);
}
exports.format = format;
function colorizeFormat(template, args, colorFunction) {
    args = colorizeArgs(args, colorFunction);
    return formatWithoutColor(template, ...args);
}
exports.colorizeFormat = colorizeFormat;
function detectFormatTemplate(msg, colorFunction) {
    const firstArg = msg[0];
    if (typeof firstArg === 'number' || typeof firstArg === 'string') {
        return [colorizeFormat(firstArg, msg.slice(1), colorFunction)];
    }
    return msg;
}
exports.detectFormatTemplate = detectFormatTemplate;
function formatObject(obj, options) {
    let indentation = 0;
    if ((options === null || options === void 0 ? void 0 : options.indentation) != null) {
        indentation = options.indentation;
    }
    const output = [];
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key) && obj[key] != null) {
            output.push(fast_printf_1.printf('%s%s: %s', ' '.repeat(indentation), color.blue(key), obj[key]));
        }
    }
    return output.join('\n');
}
exports.formatObject = formatObject;
