/* jshint esversion: 6 */

/**
 * @file Build a TeX file of all piano scores.
 */

'use strict';

/**
 *
 */
var texCmd = function(command, value) {
  return '\\tmp' + command + '{' + value  + '}\n';
}

/**
 *
 */
var texSong = function(folder) {
  var info = getSongInfo(folder);
  var eps = getFolderFiles(p(folder, config.pianoFolder), '.eps');
  var output = '';

  if (info.hasOwnProperty('title') && eps.length > 0) {
    output += texCmd('heading', info.title);
    var basename = path.basename(folder);
    eps.forEach(
      (file) => {
        output += texCmd('image', path.join(basename, config.pianoFolder, file));
      }
    );
  }
  return output;
};

/**
 *
 */
var texABC = function(alpha) {
  return '\n\n' + texCmd('chapter', alpha.toUpperCase());
}

/**
 * Generate TeX file for the piano version of the songbook
 */
var generateTeX = function() {
  var previousInitial;
  var initial;
  var TeXFile = p(config.path, config.tex);
  fs.removeSync(TeXFile);
  getSongFolders().forEach((folder) => {


  });
};
exports.generateTeX = generateTeX;
