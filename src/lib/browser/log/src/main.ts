import { printf } from 'fast-printf'
import * as logging from 'loglevel'

import * as color from './color'

export const colorize = color

const ansiRegexp = /\u001b\[.*?m/

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
type FormatString = string | number

export function format (template: FormatString, ...args: any[]): string {
  args = args.map(value => {
    if (typeof value !== 'string' || (typeof value === 'string' && value.match(ansiRegexp))) {
      return value
    }
    return color.yellow(value)
  })
  if (typeof template === 'number') {
    template = template.toString()
  }
  return printf(template, ...args)
}

/**
 * Log on level 5.
 */
export function trace (template: FormatString, ...args: any[]): void {
  logging.trace(format(template, ...args))
}

/**
 * Log on level 4.
 */
export function debug (template: FormatString, ...args: any[]): void {
  logging.debug(format(template, ...args))
}

/**
 * Log on level 3.
 */
export function info (template: FormatString, ...args: any[]): void {
  logging.info(format(template, ...args))
}

/**
 * Log on level 2.
 */
export function warn (template: FormatString, ...args: any[]): void {
  logging.warn(format(template, ...args))
}

/**
 * Log on level 1.
 */
export function error (template: FormatString, ...args: any[]): void {
  logging.error(format(template, ...args))
}

type LogLevel = 0 | 1 | 2 | 3 | 4 | 5

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
export function setLogLevel (level: LogLevel): void {
  // loglevel
  // 5 -> TRACE:  0 (5 - 5)
  // 4 -> DEBUG:  1 (5 - 4)
  // 3 -> INFO:   2 (5 - 3)
  // 2 -> WARN:   3 (5 - 2)
  // 1 -> ERROR:  4 (5 - 1)
  // 0 -> SILENT: 5 (5 - 0)
  logging.setLevel(5 - level as logging.LogLevelNumbers)
}
