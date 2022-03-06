import chalk from 'chalk'

export const red = chalk.red
export const green = chalk.green
export const yellow = chalk.yellow
export const blue = chalk.blue
export const magenta = chalk.magenta
export const cyan = chalk.cyan
export const gray = chalk.gray

export type ColorName =
  | 'red'
  | 'green'
  | 'yellow'
  | 'blue'
  | 'magenta'
  | 'cyan'
  | 'gray'
  | 'none'

export function getColorFunction (
  colorName: ColorName
): (input: unknown) => string {
  switch (colorName) {
    case 'red':
      return chalk.red

    case 'green':
      return chalk.green

    case 'yellow':
      return chalk.yellow

    case 'blue':
      return chalk.blue

    case 'magenta':
      return chalk.magenta

    case 'cyan':
      return chalk.cyan

    case 'gray':
      return chalk.gray

    case 'none':
    default:
      return function (input: unknown): string {
        if (typeof input !== 'string') {
          return String(input)
        }
        return input
      }
  }
}
