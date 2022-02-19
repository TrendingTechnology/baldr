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
import { FormatOptions } from './format';
/**
 * Log always using a printf like format string.
 */
export declare function always(template: string, args?: any[], options?: FormatOptions): void;
/**
 * Log always any data types.
 *
 * The log levels are:  0 (silent), 1 (error), 2 (warn), 3 (info), 4 (verbose),
 * 5 (debug).
 **/
export declare function alwaysAny(...args: any[]): void;
export declare function isError(): boolean;
/**
 * Log using a printf like format string at level 1.
 *
 * The log levels are:  0 (silent), 1 (error), 2 (warn), 3 (info), 4 (verbose),
 * 5 (debug).
 */
export declare function error(template: string, args?: any[], options?: FormatOptions): void;
/**
 * Log any data types at level 1.
 *
 * The log levels are:  0 (silent), 1 (error), 2 (warn), 3 (info), 4 (verbose),
 * 5 (debug).
 **/
export declare function errorAny(...args: any[]): void;
export declare function isWarn(): boolean;
/**
 * Log using a printf like format string at level 2.
 *
 * The log levels are:  0 (silent), 1 (error), 2 (warn), 3 (info), 4 (verbose),
 * 5 (debug).
 */
export declare function warn(template: string, args?: any[], options?: FormatOptions): void;
/**
 * Log any data types at level 2.
 *
 * The log levels are:  0 (silent), 1 (error), 2 (warn), 3 (info), 4 (verbose),
 * 5 (debug).
 **/
export declare function warnAny(...args: any[]): void;
export declare function isInfo(): boolean;
/**
 * Log using a printf like format string at level 3.
 *
 * The log levels are:  0 (silent), 1 (error), 2 (warn), 3 (info), 4 (verbose),
 * 5 (debug).
 **/
export declare function info(template: string, args?: any[], options?: FormatOptions): void;
/**
 * Log any data types at level 3.
 *
 * The log levels are:  0 (silent), 1 (error), 2 (warn), 3 (info), 4 (verbose),
 * 5 (debug).
 **/
export declare function infoAny(...args: any[]): void;
export declare function isVerbose(): boolean;
/**
 * Log using a printf like format string at level 4.
 *
 * The log levels are:  0 (silent), 1 (error), 2 (warn), 3 (info), 4 (verbose),
 * 5 (debug).
 **/
export declare function verbose(template: string, args?: any[], options?: FormatOptions): void;
/**
 * Log any data types at level 4.
 *
 * The log levels are:  0 (silent), 1 (error), 2 (warn), 3 (info), 4 (verbose),
 * 5 (debug).
 **/
export declare function verboseAny(...args: any[]): void;
export declare function isDebug(): boolean;
/**
 * Log using a printf like format string at level 5.
 *
 * The log levels are:  0 (silent), 1 (error), 2 (warn), 3 (info), 4 (verbose),
 * 5 (debug).
 **/
export declare function debug(template: string, args?: any[], options?: FormatOptions): void;
/**
 * Log any data types at level 5.
 *
 * The log levels are:  0 (silent), 1 (error), 2 (warn), 3 (info), 4 (verbose),
 * 5 (debug).
 **/
export declare function debugAny(...args: any[]): void;
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
export declare function setLogLevel(level: number): void;
