import { format } from './format';
let logLevel = 0;
/**
 * Log on level 1.
 *
 * @param msg - A string in the “printf” format (`Hello, %s`) followed by any
 *   arguments or any arguments the function console.log() accepts.
 */
export function always(template, args) {
    console.log(format(template, args, 'green'));
}
/**
 * Log on level 1.
 *
 * @param msg - A string in the “printf” format (`Hello, %s`) followed by any
 *   arguments or any arguments the function console.log() accepts.
 */
export function error(template, args) {
    if (logLevel > 0) {
        console.error(format(template, args, 'red'));
    }
}
/**
 * Log on level 2.
 *
 * @param msg - A string in the “printf” format (`Hello, %s`) followed by any
 *   arguments or any arguments the function console.log() accepts.
 */
export function warn(template, args) {
    if (logLevel > 1) {
        console.warn(format(template, args, 'yellow'));
    }
}
/**
 * Log with a format string on level 3.
 *
 * @param msg - A string in the “printf” format (`Hello, %s`) followed by any
 *   arguments or any arguments the function console.log() accepts.
 */
export function info(template, args) {
    if (logLevel > 2) {
        console.info(format(template, args, 'blue'));
    }
}
/**
 * Log on level 4.
 *
 * @param msg - A string in the “printf” format (`Hello, %s`) followed by any
 *   arguments or any arguments the function console.log() accepts.
 */
export function verbose(template, args) {
    if (logLevel > 3) {
        console.debug(format(template, args, 'magenta'));
    }
}
/**
 * Log on level 5.
 *
 * @param msg - A string in the “printf” format (`Hello, %s`) followed by any
 *   arguments or any arguments the function console.log() accepts.
 */
export function debug(template, args) {
    if (logLevel > 4) {
        console.log(format(template, args, 'cyan'));
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
