import { detectFormatTemplate } from './format'

let logLevel = 0

/**
 * Log on level 1.
 *
 * @param msg - A string in the “printf” format (`Hello, %s`) followed by any
 *   arguments or any arguments the function console.log() accepts.
 */
export function error (...msg: any[]): void {
  if (logLevel > 0) {
    console.error(...detectFormatTemplate(...msg))
  }
}

/**
 * Log on level 2.
 *
 * @param msg - A string in the “printf” format (`Hello, %s`) followed by any
 *   arguments or any arguments the function console.log() accepts.
 */
export function warn (...msg: any[]): void {
  if (logLevel > 1) {
    console.warn(...detectFormatTemplate(...msg))
  }
}

/**
 * Log with a format string on level 3.
 *
 * @param msg - A string in the “printf” format (`Hello, %s`) followed by any
 *   arguments or any arguments the function console.log() accepts.
 */
export function info (...msg: any[]): void {
  if (logLevel > 2) {
    console.info(...detectFormatTemplate(...msg))
  }
}

/**
 * Log on level 4.
 *
 * @param msg - A string in the “printf” format (`Hello, %s`) followed by any
 *   arguments or any arguments the function console.log() accepts.
 */
export function verbose (...msg: any[]): void {
  if (logLevel > 3) {
    console.debug(...detectFormatTemplate(...msg))
  }
}

/**
 * Log on level 5.
 *
 * @param msg - A string in the “printf” format (`Hello, %s`) followed by any
 *   arguments or any arguments the function console.log() accepts.
 */
export function debug (...msg: any[]): void {
  if (logLevel > 4) {
    console.log(...detectFormatTemplate(...msg))
  }
}

/**
 * Set the log level.
 *
 * - 0: silent
 * - 1: error
 * - 2: warn
 * - 3: info
 * - 4: verbose
 * - 5: debug
 *
 * @param level - A number from 0 (silent) up to 5 (debug)
 */
export function setLogLevel (level: number): void {
  if (level < 0 || level > 5) {
    throw new Error('Allowed values for the log levels are: 0-5')
  }
  logLevel = level
}
