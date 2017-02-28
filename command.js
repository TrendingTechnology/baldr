#! /usr/bin/env node

'use strict';

try {
  var slu = require('songbook-library-update');
}
catch (e) {
  if (e instanceof Error && e.code === 'MODULE_NOT_FOUND')
    var slu = require('./index');
}

var commander = require('commander');

commander
  .version('0.0.5')
  .option('-f, --force', 'rebuild all images')
  .option('-j, --json', 'generate JSON file')
  .option('-t, --tex', 'generate TeX file')
  .parse(process.argv);

if (commander.force) {
  slu.bootstrapConfig({force: true});
}
else {
  slu.bootstrapConfig();
}

if (commander.json) {
  slu.generateJSON();
} else if (commander.tex) {
  slu.generateTeX();
} else {
  slu.update();
}
