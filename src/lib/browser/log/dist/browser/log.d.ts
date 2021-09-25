/**
 * Log with a format string on level 5.
 *
 * @param msg - A string in the “printf” format (`Hello, %s`) followed by any
 *   arguments or any arguments the function console.log() accepts.
 */
export declare function trace(...msg: any[]): void;
/**
 * Log with a format string on level 4.
 *
 * @param msg - A string in the “printf” format (`Hello, %s`) followed by any
 *   arguments or any arguments the function console.log() accepts.
 */
export declare function debug(...msg: any[]): void;
/**
 * Log with a format string on level 3.
 *
 * @param msg - A string in the “printf” format (`Hello, %s`) followed by any
 *   arguments or any arguments the function console.log() accepts.
 */
export declare function info(...msg: any[]): void;
/**
 * Log on level 2.
 *
 * @param msg - A string in the “printf” format (`Hello, %s`) followed by any
 *   arguments or any arguments the function console.log() accepts.
 */
export declare function warn(...msg: any[]): void;
/**
 * Log on level 1.
 *
 * @param msg - A string in the “printf” format (`Hello, %s`) followed by any
 *   arguments or any arguments the function console.log() accepts.
 */
export declare function error(...msg: any[]): void;
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
export declare function setLogLevel(level: number): void;
