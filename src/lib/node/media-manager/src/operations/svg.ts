import { readFile, writeFile } from '@bldr/file-reader-writer'

export function removeWidthHeightInSvg (filePath: string): void {
  let content = readFile(filePath)
  content = content.replace(/<svg.*?>/si, function (substring: string): string {
    substring = substring.replace(/\s*(height|width)\s*=\s*".*?"\s*\n*/ig, ' ')
    substring = substring.replace(/  +/g, ' ')
    return substring
  })
  writeFile(filePath, content)
}
