/**
 * @file Filter and resolve the input files used in the presentation.
 * @module baldr-media
 */

const path = require('path');
const fs = require('fs');
const yaml = require('js-yaml');

/**
 *
 */
class FileInfo {
  constructor(filePath) {
    this.path = path.resolve(filePath);
    this.basename = path.basename(filePath);
    this.extension = path.extname(filePath).replace('.', '');
    let info = this.readInfoYaml();
    for (let property in info) {
      this[property] = info[property];
    }
  }

  /**
   * @type {string}
   */
  get titleSafe() {
    if (this.hasOwnProperty('artist') && this.hasOwnProperty('title')) {
      return this.artist + ': ' + this.title;
    }
    else if (this.hasOwnProperty('title')) {
      return this.title;
    }
    else {
      return this.basename;
    }
  }

  /**
   * Parse the info file of a media file.
   *
   * Each media file can have a info file that stores additional
   * metadata informations.
   *
   * File path:
   * `/home/baldr/beethoven.jpg`
   *
   * Info file in the YAML file format:
   * `/home/baldr/beethoven.jpg.yml`
   */
  readInfoYaml() {
    let infoFile = this.path + '.yml';
    if (fs.existsSync(infoFile)) {
      let info = yaml.safeLoad(fs.readFileSync(infoFile, 'utf8'));
      if (typeof info === 'string') {
        return {"title": info};
      }
      else {
        return info;
      }
    }
    else {
      return false;
    }
  }
}

exports.FileInfo = FileInfo;
