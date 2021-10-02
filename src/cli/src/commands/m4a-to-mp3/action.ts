import fs from 'fs'

import * as log from '@bldr/log'

async function action (): Promise<void> {
  const files = fs.readdirSync(process.cwd())

  for (const file of files) {
    if (file.match(/\.m4a$/) != null) {
      fs.unlinkSync(file)
      log.always('Delete %s', file)
    }

    if (file.match(/\.m4a\./) != null) {
      const newFile = file.replace('.m4a.', '.mp3.')
      fs.renameSync(file, newFile)
      log.always('Rename from %s to %s', file, newFile)
    }
  }
}

module.exports = action
