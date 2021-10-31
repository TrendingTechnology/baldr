import { FormatOptions } from './format';
/**
 * Log always.
 */
export declare function always(template: string, args?: any[], options?: FormatOptions): void;
export declare function alwaysAny(...args: any[]): void;
/**
 * Log on level 1.
 */
export declare function error(template: string, args?: any[], options?: FormatOptions): void;
export declare function errorAny(...args: any[]): void;
/**
 * Log on level 2.
 */
export declare function warn(template: string, args?: any[], options?: FormatOptions): void;
export declare function warnAny(...args: any[]): void;
/**
 * Log with a format string on level 3.
 */
export declare function info(template: string, args?: any[], options?: FormatOptions): void;
export declare function infoAny(...args: any[]): void;
/**
 * Log on level 4.
 */
export declare function verbose(template: string, args?: any[], options?: FormatOptions): void;
export declare function verboseAny(...args: any[]): void;
/**
 * Log on level 5.
 */
export declare function debug(template: string, args?: any[], options?: FormatOptions): void;
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
