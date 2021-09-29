"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setLogLevel = exports.debug = exports.verbose = exports.info = exports.warn = exports.error = exports.always = void 0;
const format_1 = require("./format");
const colorize = require("./color");
let logLevel = 0;
/**
 * Log on level 1.
 *
 * @param msg - A string in the “printf” format (`Hello, %s`) followed by any
 *   arguments or any arguments the function console.log() accepts.
 */
function always(...msg) {
    console.log(...format_1.detectFormatTemplate(msg, colorize.green));
}
exports.always = always;
/**
 * Log on level 1.
 *
 * @param msg - A string in the “printf” format (`Hello, %s`) followed by any
 *   arguments or any arguments the function console.log() accepts.
 */
function error(...msg) {
    if (logLevel > 0) {
        console.error(...format_1.detectFormatTemplate(msg, colorize.red));
    }
}
exports.error = error;
/**
 * Log on level 2.
 *
 * @param msg - A string in the “printf” format (`Hello, %s`) followed by any
 *   arguments or any arguments the function console.log() accepts.
 */
function warn(...msg) {
    if (logLevel > 1) {
        console.warn(...format_1.detectFormatTemplate(msg, colorize.yellow));
    }
}
exports.warn = warn;
/**
 * Log with a format string on level 3.
 *
 * @param msg - A string in the “printf” format (`Hello, %s`) followed by any
 *   arguments or any arguments the function console.log() accepts.
 */
function info(...msg) {
    if (logLevel > 2) {
        console.info(...format_1.detectFormatTemplate(msg, colorize.blue));
    }
}
exports.info = info;
/**
 * Log on level 4.
 *
 * @param msg - A string in the “printf” format (`Hello, %s`) followed by any
 *   arguments or any arguments the function console.log() accepts.
 */
function verbose(...msg) {
    if (logLevel > 3) {
        console.debug(...format_1.detectFormatTemplate(msg, colorize.magenta));
    }
}
exports.verbose = verbose;
/**
 * Log on level 5.
 *
 * @param msg - A string in the “printf” format (`Hello, %s`) followed by any
 *   arguments or any arguments the function console.log() accepts.
 */
function debug(...msg) {
    if (logLevel > 4) {
        console.log(...format_1.detectFormatTemplate(msg, colorize.cyan));
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
