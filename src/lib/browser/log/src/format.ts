import { printf } from 'fast-printf'

import * as color from './color'

export const colorize = color

// eslint-disable-next-line no-control-regex
const ansiRegexp = /\u001b\[.*?m/

/**
 * A string in the “printf” format.
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

export function formatWithoutColor (template: FormatString, ...args: any[]): string {
  if (typeof template === 'number') {
    template = template.toString()
  }
  return printf(template, ...args)
}

export function format (template: FormatString, ...args: any[]): string {
  args = args.map(value => {
    if (typeof value !== 'string' || (typeof value === 'string' && value?.match(ansiRegexp) != null)) {
      return value
    }
    return color.yellow(value)
  })
  return formatWithoutColor(template, ...args)
}

export function detectFormatTemplate (...msg: any[]): any[] {
  const args = [...arguments]
  const firstArg = arguments[0]
  if (typeof firstArg === 'number' || typeof firstArg === 'string') {
    return [format(firstArg, ...args.slice(1))]
  }
  return args
}
