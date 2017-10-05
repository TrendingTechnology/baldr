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

var setOptions = function() {
  return commander
    .version('0.0.5')
    .option('-c, --clean', 'clean up (delete all generated files)')
    .option('-F, --folder <folder>', 'process only the given song folder')
    .option('-f, --force', 'rebuild all images')
    .option('-j, --json', 'generate JSON file')
    .option('-p --path <path>', 'Base path to a song collection.')
    .option('-T, --test', 'switch to test mode')
    .option('-t, --tex', 'generate TeX file')
    .parse(process.argv);
};

var processOptions =  function(options) {
  if (options.folder) {
    options.force = true;
  }

  let config = {
    folder: options.folder,
    force: options.force,
    path: options.path
  };

  index.bootstrapConfig(config);

  if (options.test) {
    index.setTestMode();
  }

  if (options.clean) {
    index.clean();
  } else if (options.folder) {
    index.updateSongFolder(options.folder);
  } else if (options.json) {
    index.generateJSON();
  } else if (options.tex) {
    index.generateTeX();
  } else {
    index.update();
  }
};

var main = function() {
  processOptions(setOptions());
};

if (require.main === module) {
  main();
}
