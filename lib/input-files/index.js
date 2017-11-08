/**
 * @file Filter and resolve the input files used in the presentation.
 * @module baldr-input-files
 */

const path = require('path');
const fs = require('fs');

class InputFiles {

  /**
   * @param {string} presentationPath The path which contains the
   * presentation file (*.baldr).
   */
  constructor(presentationPath) {
    this.presentationPath = presentationPath;
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
     * @param {misc} extensions An array of extensions without “.”
     *   (e. g.: ['jpg', 'gif']), a single extension as string or empty
     *   to bypass the filter mechanism and return always true.
     * @return {boolean} True if the input file has the given extension
     */
    filterFileByExtension(inputPath, extensions) {
      if (!extensions) {
        return true;
      }
      if (typeof extensions === 'string') extensions = [extensions];
      let filterExtensions = extensions.map((value) => {
        return '.' + value.toLowerCase();
      });
      let inputExtension = path.extname(inputPath).toLowerCase();
      for (let filterExtension of filterExtensions) {
        if (inputExtension === filterExtension) return true;
      }
      return false;
    }

    /**
     * @param {string} inputPath Relative or absolute path of a folder or a file.
     * @param {misc} extensions An array of extensions without “.”
     *   (e. g.: ['jpg', 'gif']), a single extension as string or empty
     *   to bypass the filter mechanism and return always true.
     * @return {array} A array of absolute file paths or an empty array.
     */
    filter(inputPath, extensions) {
      let absPath = this.resolvePath(inputPath);

      if (!fs.existsSync(absPath)) {
        return [];
      }
      let stat = fs.statSync(absPath);
      if (!stat.isDirectory() && this.filterFileByExtension(absPath, extensions)) {
        return [absPath];
      }
      else if (stat.isDirectory()) {
        return fs.readdirSync(absPath)
          .filter((filename) => {
            return this.filterFileByExtension(filename, extensions);
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

}

exports.InputFiles = InputFiles;
