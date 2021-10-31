"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setLogLevel = exports.debug = exports.verbose = exports.info = exports.warn = exports.error = exports.always = void 0;
const format_1 = require("./format");
let logLevel = 0;
/**
 * Log on level 1.
 *
 * @param msg - A string in the “printf” format (`Hello, %s`) followed by any
 *   arguments or any arguments the function console.log() accepts.
 */
function always(template, args) {
    console.log(format_1.format(template, args, 'green'));
}
exports.always = always;
/**
 * Log on level 1.
 *
 * @param msg - A string in the “printf” format (`Hello, %s`) followed by any
 *   arguments or any arguments the function console.log() accepts.
 */
function error(template, args) {
    if (logLevel > 0) {
        console.error(format_1.format(template, args, 'red'));
    }
}
exports.error = error;
/**
 * Log on level 2.
 *
 * @param msg - A string in the “printf” format (`Hello, %s`) followed by any
 *   arguments or any arguments the function console.log() accepts.
 */
function warn(template, args) {
    if (logLevel > 1) {
        console.warn(format_1.format(template, args, 'yellow'));
    }
}
exports.warn = warn;
/**
 * Log with a format string on level 3.
 *
 * @param msg - A string in the “printf” format (`Hello, %s`) followed by any
 *   arguments or any arguments the function console.log() accepts.
 */
function info(template, args) {
    if (logLevel > 2) {
        console.info(format_1.format(template, args, 'blue'));
    }
}
exports.info = info;
/**
 * Log on level 4.
 *
 * @param msg - A string in the “printf” format (`Hello, %s`) followed by any
 *   arguments or any arguments the function console.log() accepts.
 */
function verbose(template, args) {
    if (logLevel > 3) {
        console.debug(format_1.format(template, args, 'magenta'));
    }
}
exports.verbose = verbose;
/**
 * Log on level 5.
 *
 * @param msg - A string in the “printf” format (`Hello, %s`) followed by any
 *   arguments or any arguments the function console.log() accepts.
 */
function debug(template, args) {
    if (logLevel > 4) {
        console.log(format_1.format(template, args, 'cyan'));
    }
}
exports.debug = debug;
/**
 * Set the log level.
 *
 * - 0: silent
 * - 1: error (red)
 * - 2: warn (yellow)
 * - 3: info (blue)
 * - 4: verbose (magenta)
 * - 5: debug (cyan)
 *
 * @param level - A number from 0 (silent) up to 5 (debug)
 */
function setLogLevel(level) {
    if (level < 0 || level > 5) {
        throw new Error('Allowed values for the log levels are: 0-5');
    }
    logLevel = level;
}
exports.setLogLevel = setLogLevel;
