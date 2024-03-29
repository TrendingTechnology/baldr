/**
 * @module @bldr/presentation/masters/counter
 */

import { validateMasterSpec } from '../../lib/masters'

const alphabet = [
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
  'j',
  'k',
  'l',
  'm',
  'n',
  'o',
  'p',
  'q',
  'r',
  's',
  't',
  'u',
  'v',
  'w',
  'x',
  'y',
  'z'
]

/**
 * This formats are allowed:
 *
 * - arabic: 1, 2, 3, …
 * - lower: a, b, c, …
 * - upper: A, B, C, …
 */
export type Format = 'arabic' | 'lower' | 'upper' | 'roman'

/**
 * @see https://stackoverflow.com/a/41358305
 */
function convertToRoman (currentNumber: number): string {
  const roman: { [romanNumber: string]: number } = {
    M: 1000,
    CM: 900,
    D: 500,
    CD: 400,
    C: 100,
    XC: 90,
    L: 50,
    XL: 40,
    X: 10,
    IX: 9,
    V: 5,
    IV: 4,
    I: 1
  }
  let output = ''

  for (const romanNumber of Object.keys(roman)) {
    const q = Math.floor(currentNumber / roman[romanNumber])
    currentNumber -= q * roman[romanNumber]
    output += romanNumber.repeat(q)
  }

  return output
}

/**
 * Format the current counter number.
 *
 * @param currentNumber - The current count number. The first number is `1` not `0`.
 * @param format - See the type definition.
 *
 * @returns If the current counter number is higher than 26, then the alphabet
 * is no longer used.
 */
export function formatCounterNumber (
  currentNumber: number,
  format: Format
): string {
  if (format === 'lower' || (format === 'upper' && currentNumber <= 26)) {
    const glyph = alphabet[currentNumber - 1]
    if (format === 'upper') {
      return glyph.toUpperCase()
    }
    return glyph
  }
  if (format === 'roman') {
    return convertToRoman(currentNumber)
  }
  return `${currentNumber}`
}

export default validateMasterSpec({
  name: 'counter',
  title: 'Zähler',
  propsDef: {
    to: {
      type: Number,
      required: true,
      description: 'Zähle bis zu dieser Zahl. In arabischen Zahlen angeben.'
    },
    format: {
      default: 'arabic',
      description:
        'In welchem Format aufgezählt werden soll: arabic (arabische Zahlen), lower (Kleinbuchstaben), upper (Großbuchstaben), roman (Römische Zahlen).'
    }
  },
  icon: {
    name: 'master-counter',
    color: 'black',
    size: 'large'
  },
  styleConfig: {
    centerVertically: true,
    darkMode: true
  },
  hooks: {
    normalizeProps (props) {
      if (typeof props === 'string') {
        props = {
          to: parseInt(props)
        }
      } else if (typeof props === 'number') {
        props = {
          to: props
        }
      }
      return props
    },
    collectPropsMain (props) {
      return {
        to: props.to,
        toFormatted: formatCounterNumber(props.to, props.format),
        format: props.format
      }
    },
    calculateStepCount ({ props }): number {
      return props.to
    },
    plainTextFromProps (props): string {
      return `${props.to}`
    }
  }
})
