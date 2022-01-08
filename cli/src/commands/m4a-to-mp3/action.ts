import fs from 'fs'

import * as log from '@bldr/log'

export default async function action (): Promise<void> {
  const files = fs.readdirSync(process.cwd())

  for (const file of files) {
    if (file.match(/\.m4a$/) != null) {
      fs.unlinkSync(file)
      log.always('Delete %s', [file])
    }

    if (file.match(/\.m4a.+/i) != null) {
      const newFile = file.replace(/\.m4a/i, '.mp3')
      fs.renameSync(file, newFile)
      log.always('Rename from %s to %s', [file, newFile])
    }
  }
}
