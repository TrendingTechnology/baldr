import { readFile, writeFile } from '@bldr/file-reader-writer'

export function removeWidthHeightInSvg (filePath: string): void {
  let content = readFile(filePath)
  content = content.replace(/<svg.*?>/is, function (substring: string): string {
    substring = substring.replace(/\n*\s*(height|width)\s*=\s*".*?"/gi, '')
    return substring
  })
  writeFile(filePath, content)
}
