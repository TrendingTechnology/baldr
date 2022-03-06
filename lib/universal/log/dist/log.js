/**
 * @file The implementation of the log functions.
 *
 * # The log levels:
 *
 * - 0: silent
 * - 1: error (red)
 * - 2: warn (yellow)
 * - 3: info (green)
 * - 4: verbose (blue)
 * - 5: debug (magenta)
 * - 6: silly (cyan)
 * - 7: insane (gray)
 */
import { format } from './format';
let logLevel = 2;
/**
 * Log always using a printf like format string.
 */
export function always(template, args, options) {
    if (options == null) {
        options = 'green';
    }
    console.log(format(template, args, options));
}
/**
 * Log always any data types.
 *
 * The log levels are:  0 (silent), 1 (error), 2 (warn), 3 (info), 4 (verbose),
 * 5 (debug), 6 (silly), 7 (insane).
 **/
export function alwaysAny(...args) {
    console.log(...args);
}
export function isError() {
    return logLevel > 0;
}
/**
 * Log using a printf like format string at level 1.
 *
 * The log levels are:  0 (silent), 1 (error), 2 (warn), 3 (info), 4 (verbose),
 * 5 (debug), 6 (silly), 7 (insane).
 */
export function error(template, args, options) {
    if (isError()) {
        if (options == null) {
            options = 'red';
        }
        console.error(format(template, args, 'red'));
    }
}
/**
 * Log any data types at level 1.
 *
 * The log levels are:  0 (silent), 1 (error), 2 (warn), 3 (info), 4 (verbose),
 * 5 (debug), 6 (silly), 7 (insane).
 **/
export function errorAny(...args) {
    if (isError()) {
        console.error(...args);
    }
}
export function isWarn() {
    return logLevel > 1;
}
/**
 * Log using a printf like format string at level 2.
 *
 * The log levels are:  0 (silent), 1 (error), 2 (warn), 3 (info), 4 (verbose),
 * 5 (debug), 6 (silly), 7 (insane).
 */
export function warn(template, args, options) {
    if (isWarn()) {
        if (options == null) {
            options = 'yellow';
        }
        console.warn(format(template, args, options));
    }
}
/**
 * Log any data types at level 2.
 *
 * The log levels are:  0 (silent), 1 (error), 2 (warn), 3 (info), 4 (verbose),
 * 5 (debug), 6 (silly), 7 (insane).
 **/
export function warnAny(...args) {
    if (isWarn()) {
        console.warn(...args);
    }
}
export function isInfo() {
    return logLevel > 2;
}
/**
 * Log using a printf like format string at level 3.
 *
 * The log levels are:  0 (silent), 1 (error), 2 (warn), 3 (info), 4 (verbose),
 * 5 (debug), 6 (silly), 7 (insane).
 **/
export function info(template, args, options) {
    if (isInfo()) {
        if (options == null) {
            options = 'green';
        }
        console.info(format(template, args, options));
    }
}
/**
 * Log any data types at level 3.
 *
 * The log levels are:  0 (silent), 1 (error), 2 (warn), 3 (info), 4 (verbose),
 * 5 (debug), 6 (silly), 7 (insane).
 **/
export function infoAny(...args) {
    if (isInfo()) {
        console.info(...args);
    }
}
export function isVerbose() {
    return logLevel > 3;
}
/**
 * Log using a printf like format string at level 4.
 *
 * The log levels are:  0 (silent), 1 (error), 2 (warn), 3 (info), 4 (verbose),
 * 5 (debug), 6 (silly), 7 (insane).
 **/
export function verbose(template, args, options) {
    if (isVerbose()) {
        if (options == null) {
            options = 'blue';
        }
        console.debug(format(template, args, options));
    }
}
/**
 * Log any data types at level 4.
 *
 * The log levels are:  0 (silent), 1 (error), 2 (warn), 3 (info), 4 (verbose),
 * 5 (debug), 6 (silly), 7 (insane).
 **/
export function verboseAny(...args) {
    if (isVerbose()) {
        console.debug(...args);
    }
}
export function isDebug() {
    return logLevel > 4;
}
/**
 * Log using a printf like format string at level 5.
 *
 * The log levels are:  0 (silent), 1 (error), 2 (warn), 3 (info), 4 (verbose),
 * 5 (debug), 6 (silly), 7 (insane).
 **/
export function debug(template, args, options) {
    if (isDebug()) {
        if (options == null) {
            options = 'magenta';
        }
        console.log(format(template, args, options));
    }
}
/**
 * Log any data types at level 5.
 *
 * The log levels are:  0 (silent), 1 (error), 2 (warn), 3 (info), 4 (verbose),
 * 5 (debug), 6 (silly), 7 (insane).
 **/
export function debugAny(...args) {
    if (isDebug()) {
        console.log(...args);
    }
}
export function isSilly() {
    return logLevel > 5;
}
/**
 * Log using a printf like format string at level 6.
 *
 * The log levels are:  0 (silent), 1 (error), 2 (warn), 3 (info), 4 (verbose),
 * 5 (debug), 6 (silly), 7 (insane).
 **/
export function silly(template, args, options) {
    if (isSilly()) {
        if (options == null) {
            options = 'cyan';
        }
        console.log(format(template, args, options));
    }
}
/**
 * Log any data types at level 6.
 *
 * The log levels are:  0 (silent), 1 (error), 2 (warn), 3 (info), 4 (verbose),
 * 5 (debug), 6 (silly), 7 (insane).
 **/
export function sillyAny(...args) {
    if (isSilly()) {
        console.log(...args);
    }
}
export function isInsane() {
    return logLevel > 6;
}
/**
 * Log using a printf like format string at level 7.
 *
 * The log levels are:  0 (silent), 1 (error), 2 (warn), 3 (info), 4 (verbose),
 * 5 (debug), 6 (silly), 7 (insane).
 **/
export function insane(template, args, options) {
    if (isInsane()) {
        if (options == null) {
            options = 'gray';
        }
        console.log(format(template, args, options));
    }
}
/**
 * Log any data types at level 7.
 *
 * The log levels are:  0 (silent), 1 (error), 2 (warn), 3 (info), 4 (verbose),
 * 5 (debug), 6 (silly), 7 (insane).
 **/
export function insaneAny(...args) {
    if (isInsane()) {
        console.log(...args);
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
 * - 5: debug (magenta)
 * - 6: silly (cyan)
 * - 7: insane (gray)
 *
 * @param level - A number from 0 (silent) up to 7 (debug)
 */
export function setLogLevel(level) {
    if (level < 0 || level > 7) {
        throw new Error('Allowed values for the log levels are: 0-7');
    }
    logLevel = level;
}
