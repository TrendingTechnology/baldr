import { format } from './format';
let logLevel = 2;
/**
 * Log always.
 */
export function always(template, args, options) {
    if (options == null) {
        options = 'green';
    }
    console.log(format(template, args, options));
}
export function alwaysAny(...args) {
    console.log(...args);
}
/**
 * Log on level 1.
 */
export function error(template, args, options) {
    if (logLevel > 0) {
        if (options == null) {
            options = 'red';
        }
        console.error(format(template, args, 'red'));
    }
}
export function errorAny(...args) {
    if (logLevel > 0) {
        console.error(...args);
    }
}
/**
 * Log on level 2.
 */
export function warn(template, args, options) {
    if (logLevel > 1) {
        if (options == null) {
            options = 'yellow';
        }
        console.warn(format(template, args, options));
    }
}
export function warnAny(...args) {
    if (logLevel > 1) {
        console.warn(...args);
    }
}
/**
 * Log with a format string on level 3.
 */
export function info(template, args, options) {
    if (logLevel > 2) {
        if (options == null) {
            options = 'blue';
        }
        console.info(format(template, args, options));
    }
}
export function infoAny(...args) {
    if (logLevel > 2) {
        console.info(...args);
    }
}
/**
 * Log on level 4.
 */
export function verbose(template, args, options) {
    if (logLevel > 3) {
        if (options == null) {
            options = 'magenta';
        }
        console.debug(format(template, args, options));
    }
}
export function verboseAny(...args) {
    if (logLevel > 3) {
        console.debug(...args);
    }
}
/**
 * Log on level 5.
 */
export function debug(template, args, options) {
    if (logLevel > 4) {
        if (options == null) {
            options = 'cyan';
        }
        console.log(format(template, args, options));
    }
}
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
