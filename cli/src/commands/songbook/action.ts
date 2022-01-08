// Project packages.
import * as log from '@bldr/log'
import {
  IntermediateLibrary,
  GenerationMode
} from '@bldr/songbook-intermediate-files'
import { getConfig } from '@bldr/config'

const config = getConfig()

interface Options {
  basePath: string
  clean: boolean
  folder: string
  force: boolean
  groupAlphabetically: boolean
  json: boolean
  list: string
  pageTurnOptimized: boolean
  piano: boolean
  slides: boolean
  songId: string
}

/**
 * @param cmdObj - An object containing options as key-value pairs.
 *  This parameter comes from `commander.Command.opts()`
 */
export default function action (cmdObj: Options): void {
  if (cmdObj.folder != null) {
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

  if (cmdObj.basePath != null && cmdObj.basePath.length > 0) {
    config.songbook.path = cmdObj.basePath
  }

  // To avoid strange behavior when creating the piano score
  if (!{}.hasOwnProperty.call(cmdObj, 'groupAlphabetically')) {
    cmdObj.groupAlphabetically = false
  }
  if (!{}.hasOwnProperty.call(cmdObj, 'pageTurnOptimized')) {
    cmdObj.pageTurnOptimized = false
  }

  log.info('The base path of the song collection is located at:\n    %s\n', [
    log.colorize.cyan(config.songbook.path)
  ])

  const library = new IntermediateLibrary(config.songbook.path)
  log.info('Found %s songs.', [library.countSongs()])
  if (cmdObj.list != null) library.loadSongList(cmdObj.list)

  if (cmdObj.clean) {
    library.cleanIntermediateFiles()
  } else if (cmdObj.folder != null) {
    library.updateSongByPath(cmdObj.folder, mode)
  } else if (cmdObj.songId != null) {
    library.updateSongBySongId(cmdObj.songId, mode)
  } else if (cmdObj.json != null) {
    library.generateLibraryJson()
  } else {
    library.update(mode, cmdObj.force)

    if (mode === 'piano' || mode === 'all') {
      library.compilePianoScore(
        cmdObj.groupAlphabetically,
        cmdObj.pageTurnOptimized
      )
    }
  }
}
