import { format } from './format'

let logLevel = 0

/**
 * Log always.
 */
export function always (template: string, args?: any[]): void {
  console.log(format(template, args, 'green'))
}

export function alwaysAny (...args: any[]): void {
  console.log(...args)
}

/**
 * Log on level 1.
 */
export function error (template: string, args?: any[]): void {
  if (logLevel > 0) {
    console.error(format(template, args, 'red'))
  }
}

export function errorAny (...args: any[]): void {
  if (logLevel > 0) {
    console.error(...args)
  }
}

/**
 * Log on level 2.
 */
export function warn (template: string, args?: any[]): void {
  if (logLevel > 1) {
    console.warn(format(template, args, 'yellow'))
  }
}

export function warnAny (...args: any[]): void {
  if (logLevel > 1) {
    console.warn(...args)
  }
}

/**
 * Log with a format string on level 3.
 */
export function info (template: string, args?: any[]): void {
  if (logLevel > 2) {
    console.info(format(template, args, 'blue'))
  }
}

export function infoAny (...args: any[]): void {
  if (logLevel > 2) {
    console.info(...args)
  }
}

/**
 * Log on level 4.
 */
export function verbose (template: string, args?: any[]): void {
  if (logLevel > 3) {
    console.debug(format(template, args, 'magenta'))
  }
}

export function verboseAny (...args: any[]): void {
  if (logLevel > 3) {
    console.debug(...args)
  }
}

/**
 * Log on level 5.
 */
export function debug (template: string, args?: any[]): void {
  if (logLevel > 4) {
    console.log(format(template, args, 'cyan'))
  }
}

export function debugAny (...args: any[]): void {
  if (logLevel > 4) {
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
