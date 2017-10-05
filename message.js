'use strict';

const colors = require('colors');
const fs = require('fs');
const path = require('path');

const warning = 'Warning! '.yellow;
const error = 'Error! '.red;

const arrow = '✓'.green;

/**
 * Print out or return text.
 * @param {string} text - Text to display.
 */
var info = function(text) {
  console.log(text);
};

/**
 *
 */
var noConfigPath = function() {
  var output = error +
    'No config file \'~/html5-school-presentation.json\' found!';
  const sampleConfig = fs.readFileSync(
    path.join(__dirname, 'sample.config.json'), 'utf8'
  );
  output += '\nCreate a config file with this keys:\n' + sampleConfig;
  info(output);
  throw new Error('No configuration file found.');
};

var songFolder = function(stat) {
  info(stat);
};

exports.info = info;
exports.noConfigPath = noConfigPath;
exports.songFolder = songFolder;
