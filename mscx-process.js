/**
 * @file Process the various *.mscx files to various other file formats
 * (*.pdf, *.eps, *.svg)
 */

'use strict';

const fs = require('fs-extra');
const path = require('path');
const spawn = require('child_process').spawnSync;
const folderTree = require('./folder-tree.js');

/**
 * Check if executable is installed.
 * @param {string} executable - Name of the executable.
 */
var checkExecutable = function(executable) {
  var exec = spawn(executable, ['--help']);
  if (exec.status === null) {
    return false;
  }
  else {
    return true;
  }
};

/**
 * Check if executables are installed.
 * @param {array} executables - Name of the executables.
 */
var checkExecutables = function(executables = []) {
  var status = true;
  var unavailable = [];
  executables.forEach((exec) => {
    var check = checkExecutable(exec);
    if (!check) {
      status = false;
      unavailable.push(exec);
    }
  });
  return {"status": status, "unavailable": unavailable};
};

/**
 * Execute git pull if repository exists.
 */
var gitPull = function(basePath) {
  if (fs.existsSync(path.join(basePath, '.git'))) {
    return spawn('git', ['pull'], {cwd: basePath});
  }
  else {
    return false;
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
    path.join(folder, destination + '.pdf'),
    path.join(folder, source + '.mscx')
  ]);
};

/**
 * Generate svg files in a 'slides' subfolder.
 * @param {string} folder - A song folder.
 */
var generateSlides = function(folder) {
  var slides = path.join(folder, 'slides');
  fs.removeSync(slides);
  fs.mkdirSync(slides);

  let pdf2svg = spawn('pdf2svg', [
    path.join(folder, 'projector.pdf'),
    path.join(slides, '%02d.svg'),
    'all'
  ]);

  let files = folderTree.getFolderFiles(slides, '.svg');

  if (files.length === 0) {
    return false;
  }
  else {
    return files;
  }
};

/**
 * Generate a PDF named piano.pdf a) from piano.mscx or b) from lead.mscx
 * @param {string} folder - A song folder.
 */
var generatePianoEPS = function(folder) {
  var piano = path.join(folder, 'piano');
  fs.removeSync(piano);
  fs.mkdirSync(piano);

  if (fs.existsSync(path.join(folder, 'piano.mscx'))) {
    fs.copySync(
      path.join(folder, 'piano.mscx'),
      path.join(piano, 'piano.mscx')
    );
  }
  else if (fs.existsSync(path.join(folder, 'lead.mscx'))) {
    fs.copySync(
      path.join(folder, 'lead.mscx'),
      path.join(piano, 'piano.mscx')
    );
  }
  spawn('mscore-to-eps.sh', [path.join(piano, 'piano.mscx')]);
};

exports.checkExecutables = checkExecutables;
exports.generatePDF = generatePDF;
exports.generatePianoEPS = generatePianoEPS;
exports.generateSlides = generateSlides;
exports.getMscoreCommand = getMscoreCommand;
exports.gitPull = gitPull;
