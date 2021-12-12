"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.setLogLevel = exports.debugAny = exports.debug = exports.verboseAny = exports.verbose = exports.infoAny = exports.info = exports.warnAny = exports.warn = exports.errorAny = exports.error = exports.alwaysAny = exports.always = void 0;
const format_1 = require("./format");
let logLevel = 2;
/**
 * Log always using a printf like format string.
 */
function always(template, args, options) {
    if (options == null) {
        options = 'green';
    }
    console.log((0, format_1.format)(template, args, options));
}
exports.always = always;
/**
 * Log always any data types.
 *
 * The log levels are:  0 (silent), 1 (error), 2 (warn), 3 (info), 4 (verbose),
 * 5 (debug).
 **/
function alwaysAny(...args) {
    console.log(...args);
}
exports.alwaysAny = alwaysAny;
/**
 * Log using a printf like format string at level 1.
 *
 * The log levels are:  0 (silent), 1 (error), 2 (warn), 3 (info), 4 (verbose),
 * 5 (debug).
 */
function error(template, args, options) {
    if (logLevel > 0) {
        if (options == null) {
            options = 'red';
        }
        console.error((0, format_1.format)(template, args, 'red'));
    }
}
exports.error = error;
/**
 * Log any data types at level 1.
 *
 * The log levels are:  0 (silent), 1 (error), 2 (warn), 3 (info), 4 (verbose),
 * 5 (debug).
 **/
function errorAny(...args) {
    if (logLevel > 0) {
        console.error(...args);
    }
}
exports.errorAny = errorAny;
/**
 * Log using a printf like format string at level 2.
 *
 * The log levels are:  0 (silent), 1 (error), 2 (warn), 3 (info), 4 (verbose),
 * 5 (debug).
 */
function warn(template, args, options) {
    if (logLevel > 1) {
        if (options == null) {
            options = 'yellow';
        }
        console.warn((0, format_1.format)(template, args, options));
    }
}
exports.warn = warn;
/**
 * Log any data types at level 2.
 *
 * The log levels are:  0 (silent), 1 (error), 2 (warn), 3 (info), 4 (verbose),
 * 5 (debug).
 **/
function warnAny(...args) {
    if (logLevel > 1) {
        console.warn(...args);
    }
}
exports.warnAny = warnAny;
/**
 * Log using a printf like format string at level 3.
 *
 * The log levels are:  0 (silent), 1 (error), 2 (warn), 3 (info), 4 (verbose),
 * 5 (debug).
 **/
function info(template, args, options) {
    if (logLevel > 2) {
        if (options == null) {
            options = 'green';
        }
        console.info((0, format_1.format)(template, args, options));
    }
}
exports.info = info;
/**
 * Log any data types at level 3.
 *
 * The log levels are:  0 (silent), 1 (error), 2 (warn), 3 (info), 4 (verbose),
 * 5 (debug).
 **/
function infoAny(...args) {
    if (logLevel > 2) {
        console.info(...args);
    }
}
exports.infoAny = infoAny;
/**
 * Log using a printf like format string at level 4.
 *
 * The log levels are:  0 (silent), 1 (error), 2 (warn), 3 (info), 4 (verbose),
 * 5 (debug).
 **/
function verbose(template, args, options) {
    if (logLevel > 3) {
        if (options == null) {
            options = 'blue';
        }
        console.debug((0, format_1.format)(template, args, options));
    }
}
exports.verbose = verbose;
/**
 * Log any data types at level 4.
 *
 * The log levels are:  0 (silent), 1 (error), 2 (warn), 3 (info), 4 (verbose),
 * 5 (debug).
 **/
function verboseAny(...args) {
    if (logLevel > 3) {
        console.debug(...args);
    }
}
exports.verboseAny = verboseAny;
/**
 * Log using a printf like format string at level 5.
 *
 * The log levels are:  0 (silent), 1 (error), 2 (warn), 3 (info), 4 (verbose),
 * 5 (debug).
 **/
function debug(template, args, options) {
    if (logLevel > 4) {
        if (options == null) {
            options = 'cyan';
        }
        console.log((0, format_1.format)(template, args, options));
    }
}
exports.debug = debug;
/**
 * Log any data types at level 5.
 *
 * The log levels are:  0 (silent), 1 (error), 2 (warn), 3 (info), 4 (verbose),
 * 5 (debug).
 **/
function debugAny(...args) {
    if (logLevel > 4) {
        console.log(...args);
    }
}
exports.debugAny = debugAny;
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
