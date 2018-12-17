#! /usr/bin/env node

/**
 * @file Command line interface to generate the intermediate media files for the
 * BALDR songbook.
 */

const pckg = require('../package.json')
const { bootstrapConfig, Library, PianoScore } = require('./lib.js')
const { Command } = require('commander')
const util = require('util')
const path = require('path')

/**
 * Wrapper around the node module “commander”.
 *
 * @param {*} argv - The same as process.argv
 * @param {string} version - The version string
 */
function parseCliArguments (argv, version) {
  // To get a clean commander. Otherwise we get options from mocha in the tests.
  // https://github.com/tj/commander.js/issues/438#issuecomment-274285003
  const commander = new Command()
  return commander
    .version(version)
    .option('-a, --group-alphabetically', 'List the songs in an alphabetical tree.')
    .option('-b --base-path <base-path>', 'Base path of a song collection.')
    .option('-c, --clean', 'Clean up (delete all generated files)')
    .option('-F, --folder <folder>', 'Process only the given song folder')
    .option('-f, --force', 'Rebuild all images')
    .option('-i --song-id <song-id>', 'Process only the song with the given song ID (The parent song folder).')
    .option('-l, --list <song-id-list>', 'Use a list of song IDs in a text file to specify which songs should be updated.')
    .option('-p, --piano', 'Generate the piano files only.')
    .option('-s, --slides', 'Generate the slides only.')
    .option('-t, --page-turn-optimized', 'Generate a page turn friendly piano score version.')
    .parse(argv)
}

/**
 * Main function: This function gets executed when the script is called
 * on the command line.
 */
let main = function () {
  let options = parseCliArguments(process.argv, pckg.version)

  if (options.folder) {
    options.force = true
  }

  let config = bootstrapConfig()

  let mode
  if (options.slides) {
    mode = 'slides'
  } else if (options.piano) {
    mode = 'piano'
  } else {
    mode = 'all'
  }

  if (options.basePath && options.basePath.length > 0) {
    config.path = options.basePath
  }

  // To avoid strange behavior when creating the piano score
  if (!options.hasOwnProperty('groupAlphabetically')) options.groupAlphabetically = false
  if (!options.hasOwnProperty('pageTurnOptimized')) options.pageTurnOptimized = false

  console.log(util.format('The base path of the song collection is located at:\n    %s\n', config.path.cyan))
  let library = new Library(config.path)
  console.log(util.format('Found %s songs.', library.countSongs()))
  if (options.list) library.loadSongList(options.list)

  if (options.clean) {
    library.cleanIntermediateFiles()
  } else if (options.folder) {
    library.updateSongByPath(options.folder, mode)
  } else if (options.songId) {
    library.updateSongBySongId(options.songId, mode)
  } else {
    library.update(mode, options.force)
    if (mode === 'piano' || mode === 'all') {
      let pianoScore = new PianoScore(path.join(library.basePath, 'songs.tex'), library, options.groupAlphabetically, options.pageTurnOptimized)
      pianoScore.write()
    }
  }
}

if (require.main === module) {
  main()
}
