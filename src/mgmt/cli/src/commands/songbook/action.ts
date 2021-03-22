// Node packages.
import fs from 'fs'
import path from 'path'

// Third party packages.
import chalk from 'chalk'

// Project packages.
import { log } from '@bldr/core-node'
import {
  IntermediateLibrary,
  PianoScore,
  GenerationMode
} from '@bldr/songbook-intermediate-files'
import config from '@bldr/config'

/**
 * @param cmdObj - An object containing options as key-value pairs.
 *  This parameter comes from `commander.Command.opts()`
 */
function action (cmdObj: { [key: string]: any }): void {
  if (cmdObj.folder) {
    cmdObj.force = true
  }

  let mode: GenerationMode
  if (cmdObj.slides) {
    mode = 'slides'
  } else if (cmdObj.piano) {
    mode = 'piano'
  } else {
    mode = 'all'
  }

  if (cmdObj.basePath && cmdObj.basePath.length > 0) {
    config.songbook.path = cmdObj.basePath
  }

  // To avoid strange behavior when creating the piano score
  if (!{}.hasOwnProperty.call(cmdObj, 'groupAlphabetically')) {
    cmdObj.groupAlphabetically = false
  }
  if (!{}.hasOwnProperty.call(cmdObj, 'pageTurnOptimized')) {
    cmdObj.pageTurnOptimized = false
  }

  log(
    'The base path of the song collection is located at:\n    %s\n',
    chalk.cyan(config.songbook.path)
  )

  const library = new IntermediateLibrary(config.songbook.path)
  log('Found %s songs.', library.countSongs())
  if (cmdObj.list) library.loadSongList(cmdObj.list)

  if (cmdObj.clean) {
    library.cleanIntermediateFiles()
  } else if (cmdObj.folder) {
    library.updateSongByPath(cmdObj.folder, mode)
  } else if (cmdObj.songId) {
    library.updateSongBySongId(cmdObj.songId, mode)
  } else {
    library.update(mode, cmdObj.force)

    if (config.songbook.path) {
      const projectorPath = path.join(config.songbook.path, 'songs.json')
      fs.writeFileSync(
        projectorPath,
        JSON.stringify(library, null, '  ')
      )
      log('Create JSON file: %s', chalk.yellow(projectorPath))
    }

    if (mode === 'piano' || mode === 'all') {
      const pianoScore = new PianoScore(
        library,
        cmdObj.groupAlphabetically,
        cmdObj.pageTurnOptimized
      )
      pianoScore.compile()
    }
  }
}

export = action
