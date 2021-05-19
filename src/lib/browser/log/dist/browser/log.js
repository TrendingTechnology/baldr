import * as logging from 'loglevel';
import { detectFormatTemplate } from './format';
/**
 * Log with a format string on level 5.
 *
 * @param msg - A string in the “printf” format (`Hello, %s`) followed by any
 *   arguments or any arguments like console.log() accepts.
 */
export function trace(...msg) {
    logging.trace(...detectFormatTemplate(...msg));
}
/**
 * Log with a format string on level 4.
 *
 *
 * @param msg - A string in the “printf” format (`Hello, %s`) followed by any
 *   arguments or any arguments like console.log() accepts.
 */
export function debug(...msg) {
    logging.debug(...detectFormatTemplate(...msg));
}
/**
 * Log with a format string on level 3.
 *
 * @param msg - A string in the “printf” format (`Hello, %s`) followed by any
 *   arguments or any arguments like console.log() accepts.
 */
export function info(...msg) {
    logging.info(...detectFormatTemplate(...msg));
}
/**
 * Log on level 2.
 *
 * @param msg - A string in the “printf” format (`Hello, %s`) followed by any
 *   arguments or any arguments like console.log() accepts.
 */
export function warn(...msg) {
    logging.warn(...detectFormatTemplate(...msg));
}
/**
 * Log on level 1.
 *
 * @param msg - A string in the “printf” format (`Hello, %s`) followed by any
 *   arguments or any arguments like console.log() accepts.
 */
export function error(...msg) {
    logging.error(...detectFormatTemplate(...msg));
}
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
export function setLogLevel(level) {
    // loglevel
    // 5 -> TRACE:  0 (5 - 5)
    // 4 -> DEBUG:  1 (5 - 4)
    // 3 -> INFO:   2 (5 - 3)
    // 2 -> WARN:   3 (5 - 2)
    // 1 -> ERROR:  4 (5 - 1)
    // 0 -> SILENT: 5 (5 - 0)
    logging.setLevel(5 - level);
}
