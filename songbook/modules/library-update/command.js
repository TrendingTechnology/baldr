#! /usr/bin/env node

console.log('lol')

var slu = require('songbook-library-update');
var commander = require('commander');

commander
  .version('0.0.1')
  .option('-f, --force', 'Rebuild all images')
  .parse(process.argv);

if (commander.force) {
  slu.updateForce();
} else {
  slu.update();
}
