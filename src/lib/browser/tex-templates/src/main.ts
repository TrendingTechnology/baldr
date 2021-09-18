interface KeyValuePairs {
  [key: string]: string
}

/**
 * https://stackoverflow.com/a/67385240
 */
function foldText (
  text: string,
  charCount: number = 72,
  buildArray: string[] = []
): string[] {
  if (text.length <= charCount) {
    buildArray.push(text)
    return buildArray
  }
  let line = text.substring(0, charCount)
  const lastSpaceRgx = /\s(?!.*\s)/
  const idx = line.search(lastSpaceRgx)
  let nextIdx = charCount
  if (idx > 0) {
    line = line.substring(0, idx)
    nextIdx = idx
  }
  buildArray.push(line.trim())
  return foldText(text.substring(nextIdx), charCount, buildArray)
}

function wrapText (text: string): string {
  text = text.trim()
  return foldText(text).join('\n')
}

export function cmd (name: string, content: string): string {
  return `\\${name}{${content}}`
}

/**
 * For example `  key = { One, two, three },` or `  key = One,`
 */
export function keyValues (pairs: KeyValuePairs): string {
  const output = []
  for (const key in pairs) {
    let value = pairs[key]
    if (value.includes(',')) {
      value = `{ ${value} }`
    }
    output.push(`  ${key} = ${value},`)
  }
  return output.join('\n')
}

export function environment (
  name: string,
  content: string,
  pairs?: KeyValuePairs
): string {
  let pairsRendered = ''
  if (pairs != null) {
    pairsRendered = '[\n' + keyValues(pairs) + '\n]'
  }
  return (
    cmd('begin', name) +
    pairsRendered +
    '\n' +
    wrapText(content) +
    '\n' +
    cmd('end', name)
  )
}
