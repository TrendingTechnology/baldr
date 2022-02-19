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

import { format, FormatOptions } from './format'

let logLevel = 2

/**
 * Log always using a printf like format string.
 */
export function always (
  template: string,
  args?: any[],
  options?: FormatOptions
): void {
  if (options == null) {
    options = 'green'
  }
  console.log(format(template, args, options))
}

/**
 * Log always any data types.
 *
 * The log levels are:  0 (silent), 1 (error), 2 (warn), 3 (info), 4 (verbose),
 * 5 (debug).
 **/
export function alwaysAny (...args: any[]): void {
  console.log(...args)
}

export function isError (): boolean {
  return logLevel > 0
}

/**
 * Log using a printf like format string at level 1.
 *
 * The log levels are:  0 (silent), 1 (error), 2 (warn), 3 (info), 4 (verbose),
 * 5 (debug).
 */
export function error (
  template: string,
  args?: any[],
  options?: FormatOptions
): void {
  if (isError()) {
    if (options == null) {
      options = 'red'
    }
    console.error(format(template, args, 'red'))
  }
}

/**
 * Log any data types at level 1.
 *
 * The log levels are:  0 (silent), 1 (error), 2 (warn), 3 (info), 4 (verbose),
 * 5 (debug).
 **/
export function errorAny (...args: any[]): void {
  if (isError()) {
    console.error(...args)
  }
}

export function isWarn (): boolean {
  return logLevel > 1
}

/**
 * Log using a printf like format string at level 2.
 *
 * The log levels are:  0 (silent), 1 (error), 2 (warn), 3 (info), 4 (verbose),
 * 5 (debug).
 */
export function warn (
  template: string,
  args?: any[],
  options?: FormatOptions
): void {
  if (isWarn()) {
    if (options == null) {
      options = 'yellow'
    }
    console.warn(format(template, args, options))
  }
}

/**
 * Log any data types at level 2.
 *
 * The log levels are:  0 (silent), 1 (error), 2 (warn), 3 (info), 4 (verbose),
 * 5 (debug).
 **/
export function warnAny (...args: any[]): void {
  if (isWarn()) {
    console.warn(...args)
  }
}

export function isInfo (): boolean {
  return logLevel > 2
}

/**
 * Log using a printf like format string at level 3.
 *
 * The log levels are:  0 (silent), 1 (error), 2 (warn), 3 (info), 4 (verbose),
 * 5 (debug).
 **/
export function info (
  template: string,
  args?: any[],
  options?: FormatOptions
): void {
  if (isInfo()) {
    if (options == null) {
      options = 'green'
    }
    console.info(format(template, args, options))
  }
}

/**
 * Log any data types at level 3.
 *
 * The log levels are:  0 (silent), 1 (error), 2 (warn), 3 (info), 4 (verbose),
 * 5 (debug).
 **/
export function infoAny (...args: any[]): void {
  if (isInfo()) {
    console.info(...args)
  }
}

export function isVerbose (): boolean {
  return logLevel > 3
}

/**
 * Log using a printf like format string at level 4.
 *
 * The log levels are:  0 (silent), 1 (error), 2 (warn), 3 (info), 4 (verbose),
 * 5 (debug).
 **/
export function verbose (
  template: string,
  args?: any[],
  options?: FormatOptions
): void {
  if (isVerbose()) {
    if (options == null) {
      options = 'blue'
    }
    console.debug(format(template, args, options))
  }
}

/**
 * Log any data types at level 4.
 *
 * The log levels are:  0 (silent), 1 (error), 2 (warn), 3 (info), 4 (verbose),
 * 5 (debug).
 **/
export function verboseAny (...args: any[]): void {
  if (isVerbose()) {
    console.debug(...args)
  }
}

export function isDebug (): boolean {
  return logLevel > 4
}

/**
 * Log using a printf like format string at level 5.
 *
 * The log levels are:  0 (silent), 1 (error), 2 (warn), 3 (info), 4 (verbose),
 * 5 (debug).
 **/
export function debug (
  template: string,
  args?: any[],
  options?: FormatOptions
): void {
  if (logLevel > 4) {
    if (options == null) {
      options = 'cyan'
    }
    console.log(format(template, args, options))
  }
}

/**
 * Log any data types at level 5.
 *
 * The log levels are:  0 (silent), 1 (error), 2 (warn), 3 (info), 4 (verbose),
 * 5 (debug).
 **/
export function debugAny (...args: any[]): void {
  if (isDebug()) {
    console.log(...args)
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
export function setLogLevel (level: number): void {
  if (level < 0 || level > 5) {
    throw new Error('Allowed values for the log levels are: 0-5')
  }
  logLevel = level
}
