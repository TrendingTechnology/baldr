import { readFile, writeFile } from '@bldr/file-reader-writer'

/**
 * Fix some typographic issues, for example quotes “…” -> „…“.
 */
export function fixTypography (filePath: string): void {
  let content = readFile(filePath)
  const before = content
  content = content.replace(/“([^“”]*)”/g, '„$1“')
  content = content.replace(/"([^"]*)"/g, '„$1“')

  // Delete spaces at the end
  content = content.replace(/[ ]*\n/g, '\n')
  // Delete multiple empty lines
  content = content.replace(/\n\n\n+/g, '\n\n')
  // One newline at the end
  content = content.replace(/(.)\n*$/g, '$1\n')
  const after = content

  if (before !== after) {
    writeFile(filePath, content)
  }
}
