import { readFile, writeFile } from '@bldr/file-reader-writer'

/**
 * Delete spaces at the end.
 */
export function removeSpacesAtLineEnd (input: string): string {
  // return input.replace(/\s+$/mg, '')
  return input.replace(/\s+\n/g, '\n')
}

/**
 * Fix some typographic issues.
 */
export function fixTypography (filePath: string): void {
  let content = readFile(filePath)
  const before = content

  content = removeSpacesAtLineEnd(content)
  // Delete multiple empty lines
  content = content.replace(/\n\n\n+/g, '\n\n')
  // One newline at the end
  content = content.replace(/(.)\n*$/g, '$1\n')
  const after = content

  if (before !== after) {
    writeFile(filePath, content)
  }
}
