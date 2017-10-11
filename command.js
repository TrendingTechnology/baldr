#! /usr/bin/env node

'use strict';

const commander = require('commander');
const fs = require('fs');
const path = require('path');
const pckg = require('./package.json');
var index = require('./index.js');


var setOptions = function(argv) {
  return commander
    .version(pckg.version)
    .option('-c, --clean', 'clean up (delete all generated files)')
    .option('-F, --folder <folder>', 'process only the given song folder')
    .option('-f, --force', 'rebuild all images')
    .option('-j, --json', 'generate JSON file')
    .option('-p --path <path>', 'Base path to a song collection.')
    .option('-T, --test', 'switch to test mode')
    .option('-t, --tex', 'generate TeX file')
    .parse(argv);
};

var processOptions =  function(options) {
  if (options.folder) {
    options.force = true;
  }

  let config = {
    folder: options.folder,
    force: options.force
  };

  if (options.path && options.path.length > 0) {
    config.path = options.path;
  }

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
  processOptions(setOptions(process.argv));
};

if (require.main === module) {
  main();
}
