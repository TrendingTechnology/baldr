/**
 * @file Filter and resolve the input files used in the presentation.
 * @module baldr-media
 */

const path = require('path');
const fs = require('fs');

class Media {

  /**
   * @param {string} presentationPath The path which contains the
   * presentation file (*.baldr).
   */
  constructor(presentationPath) {
    this.presentationPath = presentationPath;

    this.extensionDefaults = {
      audio: ['mp3'],
      image: ['jpg', 'jpeg', 'png'],
      video: ['mp4']
    };
  }

  /**
   * Get extensions to filter the input files.
   *
   * @param {array|string} extensions A array of extensions or
   * a single extension specifed as a string or a property of
   * the object “this.extensionDefaults”. An extension should be
   * noted without a leading dot (e. g.: “jpg”, “mp4”)
   *
   * @return {array} A array of extensions
   */
  getExtensions(extensions) {
    if (typeof extensions === 'object' && Array.isArray(extensions)) {
      return extensions;
    }
    else if (
      typeof extensions === 'string' &&
      this.extensionDefaults[extensions]
    ) {
      return this.extensionDefaults[extensions];
    }
    else if (typeof extensions === 'string') {
      return [extensions];
    }
    else {
      return [];
    }
  }

  /**
   * Get the absolute path of a file used in the presentation.
   *
   * @return {string} Absolute path
   */
  resolvePath(filePath) {
    if (path.isAbsolute(filePath)) {
      return filePath;
    }
    else {
      return path.resolve(this.presentationPath, filePath);
    }
  }

  /**
   * @param {string} inputPath The path of a file
   * @param {array|string} extensions A array of extensions or
   * a single extension specifed as a string or a property of
   * the object “this.extensionDefaults”. An extension should be
   * noted without a leading dot (e. g.: “jpg”, “mp4”). Leave the
   * parameter empty to bypass the filter mechanism.
   * @return {boolean} True if the input file has the given extension
   */
  filterFile(inputPath, extensions) {
    if (!extensions) {
      return true;
    }

    let filterExtensions = this.getExtensions(extensions)
      .map((value) => {
        return '.' + value.toLowerCase();
      });

    let inputExtension = path.extname(inputPath).toLowerCase();

    for (let filterExtension of filterExtensions) {
      if (inputExtension === filterExtension) return true;
    }
    return false;
  }

  /**
   * @param {string} inputPath Relative or absolute path of a folder or
   * a file.
   * @param {array|string} extensions A array of extensions or
   * a single extension specifed as a string or a property of
   * the object “this.extensionDefaults”. An extension should be
   * noted without a leading dot (e. g.: “jpg”, “mp4”). Leave the
   * parameter empty to bypass the filter mechanism.
   * @return {array} A array of absolute file paths or an empty array.
   */
  list(inputPath, extensions) {
    let absPath = this.resolvePath(inputPath);

    if (!fs.existsSync(absPath)) {
      return [];
    }
    let stat = fs.statSync(absPath);
    if (!stat.isDirectory() && this.filterFile(absPath, extensions)) {
      return [absPath];
    }
    else if (stat.isDirectory()) {
      return fs.readdirSync(absPath)
        .filter((filename) => {
          return this.filterFile(filename, extensions);
        })
        .map((filename) => {
          return path.join(absPath, filename);
        })
        .sort();
    }
    else {
      return [];
    }
  }

  /**
   * @param {array|string} inputPaths Both folder or file paths can
   * be specified.
   * @param {array|string} extensions A array of extensions or
   * a single extension specifed as a string or a property of
   * the object “this.extensionDefaults”. An extension should be
   * noted without a leading dot (e. g.: “jpg”, “mp4”). Leave the
   * parameter empty to bypass the filter mechanism.
   */
  orderedList(inputPaths, extensions) {
    let normalizedPaths;
    if (typeof inputPaths === 'string') {
      normalizedPaths = [inputPaths];
    }
    else {
      normalizedPaths = inputPaths;
    }
    let list = [];
    for (let filePath of normalizedPaths) {
      var sortedList = this.list(filePath, extensions);
      for (let file of sortedList) {
        list.push(file);
      }
    }
    return list;
  }

}

exports.Media = Media;
