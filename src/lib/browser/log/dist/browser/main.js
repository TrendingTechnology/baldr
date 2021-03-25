import { printf } from 'fast-printf';
import * as logging from 'loglevel';
import * as color from './color';
export const colorize = color;
// eslint-disable-next-line no-control-regex
const ansiRegexp = /\u001b\[.*?m/;
export function formatWithoutColor(template, ...args) {
    if (typeof template === 'number') {
        template = template.toString();
    }
    return printf(template, ...args);
}
export function format(template, ...args) {
    args = args.map(value => {
        if (typeof value !== 'string' || (typeof value === 'string' && (value === null || value === void 0 ? void 0 : value.match(ansiRegexp)) != null)) {
            return value;
        }
        return color.yellow(value);
    });
    return formatWithoutColor(template, ...args);
}
/**
 * Log on level 5.
 */
export function trace(template, ...args) {
    logging.trace(format(template, ...args));
}
/**
 * Log on level 4.
 */
export function debug(template, ...args) {
    logging.debug(format(template, ...args));
}
/**
 * Log on level 3.
 */
export function info(template, ...args) {
    logging.info(format(template, ...args));
}
/**
 * Log on level 2.
 */
export function warn(template, ...args) {
    logging.warn(format(template, ...args));
}
/**
 * Log on level 1.
 */
export function error(template, ...args) {
    logging.error(format(template, ...args));
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
