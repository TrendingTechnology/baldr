// Node packages.
const fs = require('fs')
const path = require('path')

// Third party packages.
const chalk = require('chalk')

// Project packages.
const { log } = require('@bldr/core-node')
const songbook = require('@bldr/songbook-intermediate-files')
const config = require('@bldr/config')

function action (cmdObj) {
  if (cmdObj.folder) {
    cmdObj.force = true
  }

  let mode
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

  if (cmdObj.projectorPath) config.songbook.projectorPath = cmdObj.projectorPath
  if (config.songbook.projectorPath === 'none') config.songbook.projectorPath = null
  if (config.songbook.projectorPath) {
    log(
      'The folder where all projector related files are stored is:\n    %s\n',
      chalk.green(config.songbook.projectorPath)
    )
  }

  // Maybe bug in commander ?
  if (cmdObj.piapath) cmdObj.pianoPath = cmdObj.piapath
  if (cmdObj.pianoPath) config.songbook.pianoPath = cmdObj.pianoPath
  if (config.songbook.pianoPath === 'none') config.songbook.pianoPath = null
  if (config.songbook.pianoPath) {
    log(
      'The folder where all piano related files are stored is:\n    %s\n',
      chalk.green(config.songbook.pianoPath)
    )
  }

  const library = new songbook.IntermediateLibrary(
    config.songbook.path,
    config.songbook.projectorPath,
    config.songbook.pianoPath
  )
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
    songbook.exportToMediaServer(library)

    if (mode === 'piano' || mode === 'all') {
      const pianoScore = new songbook.PianoScore(
        library,
        cmdObj.groupAlphabetically,
        cmdObj.pageTurnOptimized
      )
      pianoScore.compile()
    }
    if (config.songbook.projectorPath) {
      const projectorPath = path.join(config.songbook.projectorPath, 'songs.json')
      fs.writeFileSync(
        projectorPath,
        JSON.stringify(library, null, '  ')
      )
      log('Create JSON file: %s', chalk.yellow(projectorPath))
    }
    songbook.buildVueApp()
  }
}

module.exports = action
