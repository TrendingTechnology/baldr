import { detectFormatTemplate } from './format';
import * as colorize from './color';
let logLevel = 0;
/**
 * Log on level 1.
 *
 * @param msg - A string in the “printf” format (`Hello, %s`) followed by any
 *   arguments or any arguments the function console.log() accepts.
 */
export function error(...msg) {
    if (logLevel > 0) {
        console.error(...detectFormatTemplate(msg, colorize.red));
    }
}
/**
 * Log on level 2.
 *
 * @param msg - A string in the “printf” format (`Hello, %s`) followed by any
 *   arguments or any arguments the function console.log() accepts.
 */
export function warn(...msg) {
    if (logLevel > 1) {
        console.warn(...detectFormatTemplate(msg, colorize.yellow));
    }
}
/**
 * Log with a format string on level 3.
 *
 * @param msg - A string in the “printf” format (`Hello, %s`) followed by any
 *   arguments or any arguments the function console.log() accepts.
 */
export function info(...msg) {
    if (logLevel > 2) {
        console.info(...detectFormatTemplate(msg, colorize.blue));
    }
}
/**
 * Log on level 4.
 *
 * @param msg - A string in the “printf” format (`Hello, %s`) followed by any
 *   arguments or any arguments the function console.log() accepts.
 */
export function verbose(...msg) {
    if (logLevel > 3) {
        console.debug(...detectFormatTemplate(msg, colorize.magenta));
    }
}
/**
 * Log on level 5.
 *
 * @param msg - A string in the “printf” format (`Hello, %s`) followed by any
 *   arguments or any arguments the function console.log() accepts.
 */
export function debug(...msg) {
    if (logLevel > 4) {
        console.log(...detectFormatTemplate(msg, colorize.cyan));
    }
}
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
export function setLogLevel(level) {
    if (level < 0 || level > 5) {
        throw new Error('Allowed values for the log levels are: 0-5');
    }
    logLevel = level;
}
