'use strict';

const colors = require('colors');
const fs = require('fs');
const path = require('path');

const error = '☒'.red;
const finished = '☑'.green;
const progress = '☐'.yellow;

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

/**
 * <pre><code>
 * {
 *   "changed": {
 *     "lead": false,
 *     "piano": false,
 *     "projector": false
 *   },
 *   "folder": "songs/a/Auf-der-Mauer_auf-der-Lauer",
 *   "folderName": "Auf-der-Mauer_auf-der-Lauer",
 *   "force": true,
 *   "generated": {
 *     "piano": [
 *       "piano_1.eps",
 *       "piano_2.eps"
 *     ],
 *     "projector": "projector.pdf",
 *     "slides": [
 *       "01.svg",
 *       "02.svg"
 *     ],
 *   },
 *   "info": {
 *     "title": "Auf der Mauer, auf der Lauer"
 *   }
 * }
 * </code></pre>
 */
var songFolder = function(s) {
  let title;
  if (!s.info.title) {
    title = s.folderName.red;
  }
  else {
    title = s.folderName + ': ' + s.info.title;
  }

  let symbol;
  if (!s.info.title) {
    symbol = error;
  }
  else if (!s.changed.projector && !s.changed.piano && !s.changed.lead) {
    symbol = finished;
  }
  else {
    symbol = progress;
  }
  info(symbol + '  ' + title);
};

exports.info = info;
exports.noConfigPath = noConfigPath;
exports.songFolder = songFolder;
