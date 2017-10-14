/**
 * @file Implement message and loging functionality
 */

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
  var output = error + '  Configuration file ' +
    '“~/.baldr.json” not found!\n' +
    'Create such a config file or use the “--path” option!';

  const sampleConfig = fs.readFileSync(
    path.join(__dirname, 'sample.config.json'), 'utf8'
  );
  output += '\n\nExample configuration file:\n' + sampleConfig;

  info(output);
  throw new Error('No configuration file found.');
};

/**
 * <pre><code>
 * {
 *   "changed": {
 *     "piano": false,
 *     "slides": false
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
  let forced;
  if (s.force) {
    forced = ' ' + '(forced)'.red;
  }
  else {
    forced = '';
  }

  let symbol;
  if (!s.info.title) {
    symbol = error;
  }
  else if (!s.changed.slides && !s.changed.piano) {
    symbol = finished;
  }
  else {
    symbol = progress;
  }

  let title;
  if (!s.info.title) {
    title = s.folderName.red;
  }
  else if (!s.changed.slides && !s.changed.piano) {
    title = s.folderName.green + ': ' + s.info.title;
  }
  else {
    title = s.folderName.yellow + ': ' + s.info.title;
  }

  let output = symbol + '  ' + title + forced;
  if (s.generated.slides) {
    output +=
      '\n\t' +
      'slides'.yellow +
      ': ' +
      s.generated.slides.join(', ');
  }

  if (s.generated.piano) {
    output +=
      '\n\t' +
      'piano'.yellow +
      ': ' +
      s.generated.piano.join(', ');
  }
  info(output);
};

exports.info = info;
exports.noConfigPath = noConfigPath;
exports.songFolder = songFolder;
