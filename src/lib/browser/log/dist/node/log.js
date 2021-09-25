"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setLogLevel = exports.error = exports.warn = exports.info = exports.debug = exports.trace = void 0;
const logging = require("loglevel");
const format_1 = require("./format");
/**
 * Log with a format string on level 5.
 *
 * @param msg - A string in the “printf” format (`Hello, %s`) followed by any
 *   arguments or any arguments the function console.log() accepts.
 */
function trace(...msg) {
    if (logging.getLevel() <= logging.levels.TRACE) {
        // We don’t want stack traces as provided by console.trace().
        console.log(...format_1.detectFormatTemplate(...msg));
    }
}
exports.trace = trace;
/**
 * Log with a format string on level 4.
 *
 * @param msg - A string in the “printf” format (`Hello, %s`) followed by any
 *   arguments or any arguments the function console.log() accepts.
 */
function debug(...msg) {
    logging.debug(...format_1.detectFormatTemplate(...msg));
}
exports.debug = debug;
/**
 * Log with a format string on level 3.
 *
 * @param msg - A string in the “printf” format (`Hello, %s`) followed by any
 *   arguments or any arguments the function console.log() accepts.
 */
function info(...msg) {
    logging.info(...format_1.detectFormatTemplate(...msg));
}
exports.info = info;
/**
 * Log on level 2.
 *
 * @param msg - A string in the “printf” format (`Hello, %s`) followed by any
 *   arguments or any arguments the function console.log() accepts.
 */
function warn(...msg) {
    logging.warn(...format_1.detectFormatTemplate(...msg));
}
exports.warn = warn;
/**
 * Log on level 1.
 *
 * @param msg - A string in the “printf” format (`Hello, %s`) followed by any
 *   arguments or any arguments the function console.log() accepts.
 */
function error(...msg) {
    logging.error(...format_1.detectFormatTemplate(...msg));
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
    if (level < 0 || level > 5) {
        throw new Error('Allowed values for the log level are: 0-5');
    }
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
