import * as color from './color';
export declare const colorize: typeof color;
/**
 * A string in printf format.
 *
 * - `%c` character
 * - `%C` converts to uppercase character (if not already)
 * - `%d` decimal integer (base 10)
 * - `%0Xd` zero-fill for X digits
 * - `%Xd` right justify for X digits
 * - `%-Xd` left justify for X digits
 * - `%+d` adds plus sign(+) to positive integers, minus sign for negative integers(-)
 * - `%e` scientific notation
 * - `%E` scientific notation with a capital 'E'
 * - `%f` floating-point number
 * - `%.Yf` prints Y positions after decimal
 * - `%Xf` takes up X spaces
 * - `%0X.Yf` zero-fills
 * - `%-X.Yf` left justifies
 * - `%i` integer (base 10)
 * - `%b` converts to boolean
 * - `%B` converts to uppercase boolean
 * - `%o` octal number (base 8)
 * - `%s` a string of characters
 * - `%Xs` formats string for a minimum of X spaces
 * - `%-Xs` left justify
 * - `%S` converts to a string of uppercase characters (if not already)
 * - `%u` unsigned decimal integer
 * - `%x` number in hexadecimal (base 16)
 * - `%%` prints a percent sign
 * - `\%` prints a percent sign
 * - `%2$s %1$s` positional arguments
 */
declare type FormatString = string | number;
export declare function formatWithoutColor(template: FormatString, ...args: any[]): string;
export declare function format(template: FormatString, ...args: any[]): string;
/**
 * Log with a format string on level 5.
 */
export declare function trace(template: FormatString, ...args: any[]): void;
/**
 * A wrapper around `logging.trace()`.
 */
export declare function traceLog(...msg: any[]): void;
/**
 * Log with a format string on level 4.
 */
export declare function debug(template: FormatString, ...args: any[]): void;
/**
 * A wrapper around `logging.debug()`.
 */
export declare function debugLog(...msg: any[]): void;
/**
 * Log with a format string on level 3.
 */
export declare function info(template: FormatString, ...args: any[]): void;
/**
 * A wrapper around `logging.info()`.
 */
export declare function infoLog(...msg: any[]): void;
/**
 * Log on level 2.
 */
export declare function warn(template: FormatString, ...args: any[]): void;
/**
 * A wrapper around `logging.warn()`.
 */
export declare function warnLog(...msg: any[]): void;
/**
 * Log on level 1.
 */
export declare function error(template: FormatString, ...args: any[]): void;
/**
 * A wrapper around `logging.error()`.
 */
export declare function errorLog(...msg: any[]): void;
declare type LogLevel = 0 | 1 | 2 | 3 | 4 | 5;
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
export declare function setLogLevel(level: LogLevel): void;
export {};
