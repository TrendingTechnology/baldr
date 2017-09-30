/* jshint esversion: 6 */

/**
 * @file Process the various *.mscx files to various other file formats
 * (*.pdf, *.eps, *.svg)
 */

'use strict';

const path = require('path');
const spawn = require('child_process').spawnSync;

/**
 * Check if executable is installed.
 * @param {string} executable - Name of the executable.
 */
var checkExecutable = function(executable) {
  var exec = spawn(executable, ['--help']);
  if (exec.status === null) {
    return message('Install executable: ' + executable);
  }
};


/**
 * Get the MuseScore command.
 * @returns {string} The name of the MuseScore command.
 */
var getMscoreCommand = function() {
  if (process.platform == 'darwin') {
    return '/Applications/MuseScore 2.app/Contents/MacOS/mscore';
  } else {
    return 'mscore';
  }
};


/**
 * Generate form a given *.mscx file a PDF file.
 * @param {string} folder - Folder containing the *.mscx file.
 * @param {string} source - Name of the *.mscx file without the extension.
 * @param {string} destination - Name of the PDF without the extension.
 */
var generatePDF = function(folder, source, destination = '') {
  if (destination === '') {
    destination = source;
  }
  spawn(getMscoreCommand(), [
    '--export-to',
    p(folder, destination + '.pdf'),
    p(folder, source + '.mscx')
  ]);
};

/**
 * Generate svg files in a 'slides' subfolder.
 * @param {string} folder - A song folder.
 */
var generateSlides = function(folder) {
  var slides = p(folder, config.slidesFolder);
  fs.removeSync(slides);
  fs.mkdirSync(slides);

  spawn('pdf2svg', [
    p(folder, 'projector.pdf'),
    p(slides, '%02d.svg'),
     'all'
  ]);
  return message(folder + ': Bilder erzeugen');
};


/**
 * Generate a PDF named piano.pdf a) from piano.mscx or b) from lead.mscx
 * @param {string} folder - A song folder.
 */
var generatePianoEPS = function(folder) {
  var piano = p(folder, 'piano');
  fs.removeSync(piano);
  fs.mkdirSync(piano);

  if (fs.existsSync(p(folder, 'piano.mscx'))) {
    fs.copySync(p(folder, 'piano.mscx'), p(piano, 'piano.mscx'));
  }
  else if (fs.existsSync(p(folder, 'lead.mscx'))) {
    fs.copySync(p(folder, 'lead.mscx'), p(piano, 'piano.mscx'));
  }
  spawn('mscore-to-eps.sh', [p(piano, 'piano.mscx')]);
};
