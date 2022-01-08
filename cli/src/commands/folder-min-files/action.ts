import fs from 'fs'
import path from 'path'
import * as log from '@bldr/log'

const getAllFiles = function (dirPath: string, min: number = 20): void {
  const files = fs.readdirSync(dirPath)
  if (files.length >= min) {
    console.log('\n' + log.colorize.red(dirPath))
    for (const file of files) {
      console.log('  - ' + file)
    }
  }

  for (const file of files) {
    const filePath = path.join(dirPath, file)
    if (fs.statSync(filePath).isDirectory()) {
      getAllFiles(filePath, min)
    }
  }
}

export default async function action (
  filePath: string | undefined,
  opts: any
): Promise<void> {
  let min = 20

  if (opts.min != null) {
    min = parseInt(opts.min)
  }
  getAllFiles(filePath != null ? filePath : process.cwd(), min)
}
