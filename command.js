#! /usr/bin/env node

var slu = require('songbook-library-update');
var commander = require('commander');

commander
  .version('0.0.1')
  .option('-f, --force', 'rebuild all images')
  .option('-j, --json', 'generate JSON file')
  .parse(process.argv);

if (commander.json) {
  slu.generateJSON();
}
else if (commander.force) {
  slu.updateForce();
}
else {
  slu.update();
}
