#! /usr/bin/env node

'use strict';

const commander = require('commander');
const fs = require('fs');
const path = require('path');

try {
  var index = require('songbook-library-update');
} catch (e) {}

try {
  var index = require('./index.js');
} catch (e) {}

var main = function() {
  commander
    .version('0.0.5')
    .option('-c, --clean', 'clean up (delete all generated files)')
    .option('-F, --folder <folder>', 'process only the given song folder')
    .option('-f, --force', 'rebuild all images')
    .option('-j, --json', 'generate JSON file')
    .option('-p --path <path>', 'Base path to a song collection.')
    .option('-T, --test', 'switch to test mode')
    .option('-t, --tex', 'generate TeX file')
    .parse(process.argv);

  if (commander.folder) {
    commander.force = true;
  }

  var config = {
    folder: commander.folder,
    force: commander.force,
    path: commander.path
  };

  index.bootstrapConfig(config);

  if (commander.test) {
    index.setTestMode();
  }

  if (commander.clean) {
    index.clean();
  } else if (commander.folder) {
    index.updateSongFolder(commander.folder);
  } else if (commander.json) {
    index.generateJSON();
  } else if (commander.tex) {
    index.generateTeX();
  } else {
    index.update();
  }
};

if (require.main === module) {
  main();
}
