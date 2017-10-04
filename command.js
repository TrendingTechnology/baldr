#! /usr/bin/env node

'use strict';

const commander = require('commander');
const fs = require('fs');
const path = require('path');



// TODO: Clean up
try {
  var slu = require('songbook-library-update');
} catch (e) {
  if (e instanceof Error && e.code === 'MODULE_NOT_FOUND') {
  }
}

try {
  var slu = require('./index.js');
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

  slu.bootstrapConfig(config);

  if (commander.test) {
    slu.setTestMode();
  }

  if (commander.clean) {
    slu.clean();
  } else if (commander.json) {
    slu.generateJSON();
  } else if (commander.tex) {
    slu.generateTeX();
  } else {
    slu.update();
  }
};

if (require.main === module) {
  main();
}
