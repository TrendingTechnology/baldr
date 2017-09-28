/* jshint esversion: 6 */

/**
 * @file Retrieve a object representation of a song folder tree.
 * <pre><code>
 * .
 * ├── a
 * │   ├── Aint-she-sweet
 * │   │   ├── info.json
 * │   │   ├── piano
 * │   │   │   └── piano.mscx
 * │   │   ├── piano.mscx
 * │   │   ├── projector.mscx
 * │   │   ├── projector.pdf
 * │   │   └── slides
 * │   │       ├── 01.svg
 * │   │       └── 02.svg
 * │   ├── Altes-Fieber
 * │   │   ├── info.json
 * │   │   ├── lead.mscx
 * │   │   ├── piano
 * │   │   │   └── piano.mscx
 * │   │   ├── projector.mscx
 * │   │   ├── projector.pdf
 * │   │   └── slides
 * │   │       ├── 01.svg
 * │   │       ├── 02.svg
 * │   │       ├── 03.svg
 * │   │       ├── 04.svg
 * │   │       ├── 05.svg
 * │   │       └── 06.svg
 * </code></pre>
 */

'use strict';

const alphabet = '0abcdefghijklmnopqrstuvwxyz'.split('');

/**
 * Return the folder that might contain MuseScore files.
 * @return {array} Array of folder paths.
 */
var getSongFolders = function(folder) {
  if (config.folder) {
    return [config.folder];
  }
  var absPath = path.join(config.path, folder);
  var folders = fs.readdirSync(absPath);
  return folders.filter(
    (file) => {
      if (fs.statSync(path.join(absPath, file)).isDirectory() && file.substr(0, 1) != '_' && file.substr(0, 1) != '.') {
        return true;
      }
      else {
        return false;
      }
    }
  );
};

var getAlphabeticalFolders = function() {
  var folders = alphabet;
  return folders.filter((file) => {
    var folder = path.join(config.path, file)
    if (fs.existsSync(folder) && fs.statSync(folder).isDirectory()) {
      return true;
    }
    else {
      return false;
    }
  });
}

/**
 * <pre><code>
 * {
 *   "a": {
 *     "Auf-der-Mauer_auf-der-Lauer": {}
 *   },
 *   "s": {
 *     "Stille-Nacht": {},
 *     "Swing-low": {}
 *   },
 *   "z": {
 *     "Zum-Tanze-da-geht-ein-Maedel": {}
 *   }
 * }
 * </code></pre>
 */
var getFolderStructure = function() {
  var structure = {};
  getAlphabeticalFolders().forEach(function(item) {
    var folders = {};
    getSongFolders(item).forEach((song) => {
      folders[song] = {};
    });
    structure[item] = folders;
  });
  return structure;
}

/**
 * @return {array} Array of absolute folder paths to search for song files.
 */
var flattenFolderStructure = function(structure, basePath) {
  var flattFolders = [];
  Object.keys(structure).forEach((alpha, index) => {
    Object.keys(structure[alpha]).forEach((folder, index) => {
      flattFolders.push(path.join(basePath, alpha, folder));
    });
  });
  return flattFolders;
};
