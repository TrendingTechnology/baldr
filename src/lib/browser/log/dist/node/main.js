"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setLogLevel = exports.error = exports.warn = exports.info = exports.debug = exports.trace = exports.format = exports.formatWithoutColor = exports.colorize = void 0;
const fast_printf_1 = require("fast-printf");
const logging = require("loglevel");
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
/**
 * Log on level 5.
 */
function trace(template, ...args) {
    logging.trace(format(template, ...args));
}
exports.trace = trace;
/**
 * Log on level 4.
 */
function debug(template, ...args) {
    logging.debug(format(template, ...args));
}
exports.debug = debug;
/**
 * Log on level 3.
 */
function info(template, ...args) {
    logging.info(format(template, ...args));
}
exports.info = info;
/**
 * Log on level 2.
 */
function warn(template, ...args) {
    logging.warn(format(template, ...args));
}
exports.warn = warn;
/**
 * Log on level 1.
 */
function error(template, ...args) {
    logging.error(format(template, ...args));
}
exports.error = error;
/**
 * Set the log level.
 *
 * - 0: silent
 * - 1: error
 * - 2: warn
 * - 3: info
 * - 4: debug
 * - 5: trace
 *
 * @param level - A number from 0 (silent) up to 5 (trace)
 */
function setLogLevel(level) {
    // loglevel
    // 5 -> TRACE:  0 (5 - 5)
    // 4 -> DEBUG:  1 (5 - 4)
    // 3 -> INFO:   2 (5 - 3)
    // 2 -> WARN:   3 (5 - 2)
    // 1 -> ERROR:  4 (5 - 1)
    // 0 -> SILENT: 5 (5 - 0)
    logging.setLevel(5 - level);
}
exports.setLogLevel = setLogLevel;
