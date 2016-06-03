#! /usr/bin/env node

var slu = require('songbook-library-update');
var commander = require('commander');

commander
  .version('0.0.1')
  .option('-f, --force', 'Add peppers')
  .parse(process.argv);

if (commander.force) console.log('  - force');
