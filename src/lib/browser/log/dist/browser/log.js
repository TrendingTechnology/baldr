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
 * - 5: debug (cyan)
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
 * 5 (debug).
 **/
export function alwaysAny(...args) {
    console.log(...args);
}
/**
 * Log using a printf like format string at level 1.
 *
 * The log levels are:  0 (silent), 1 (error), 2 (warn), 3 (info), 4 (verbose),
 * 5 (debug).
 */
export function error(template, args, options) {
    if (logLevel > 0) {
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
 * 5 (debug).
 **/
export function errorAny(...args) {
    if (logLevel > 0) {
        console.error(...args);
    }
}
/**
 * Log using a printf like format string at level 2.
 *
 * The log levels are:  0 (silent), 1 (error), 2 (warn), 3 (info), 4 (verbose),
 * 5 (debug).
 */
export function warn(template, args, options) {
    if (logLevel > 1) {
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
 * 5 (debug).
 **/
export function warnAny(...args) {
    if (logLevel > 1) {
        console.warn(...args);
    }
}
/**
 * Log using a printf like format string at level 3.
 *
 * The log levels are:  0 (silent), 1 (error), 2 (warn), 3 (info), 4 (verbose),
 * 5 (debug).
 **/
export function info(template, args, options) {
    if (logLevel > 2) {
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
 * 5 (debug).
 **/
export function infoAny(...args) {
    if (logLevel > 2) {
        console.info(...args);
    }
}
/**
 * Log using a printf like format string at level 4.
 *
 * The log levels are:  0 (silent), 1 (error), 2 (warn), 3 (info), 4 (verbose),
 * 5 (debug).
 **/
export function verbose(template, args, options) {
    if (logLevel > 3) {
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
 * 5 (debug).
 **/
export function verboseAny(...args) {
    if (logLevel > 3) {
        console.debug(...args);
    }
}
/**
 * Log using a printf like format string at level 5.
 *
 * The log levels are:  0 (silent), 1 (error), 2 (warn), 3 (info), 4 (verbose),
 * 5 (debug).
 **/
export function debug(template, args, options) {
    if (logLevel > 4) {
        if (options == null) {
            options = 'cyan';
        }
        console.log(format(template, args, options));
    }
}
/**
 * Log any data types at level 5.
 *
 * The log levels are:  0 (silent), 1 (error), 2 (warn), 3 (info), 4 (verbose),
 * 5 (debug).
 **/
export function debugAny(...args) {
    if (logLevel > 4) {
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
