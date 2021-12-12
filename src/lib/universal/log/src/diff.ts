import { createTwoFilesPatch } from 'diff'
import { red, green } from 'chalk'

export function colorizeDiff (oldString: string, newString: string): string {
  const output: string[] = []

  const patch = createTwoFilesPatch('old', 'new', oldString, newString)

  const lines = patch.split(/(\n|\r\n)/)

  for (const line of lines) {
    let formattedLine: string | undefined
    if (line.charAt(0) === '+') {
      formattedLine = green(line)
    } else if (line.charAt(0) === '-') {
      formattedLine = red(line)
    } else {
      formattedLine = line
    }
    output.push(formattedLine)
  }
  return output.join('')
}
