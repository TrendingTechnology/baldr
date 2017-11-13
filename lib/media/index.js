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

/**
 *
 */
class Media {

  /**
   * @param {string} parentPath The path which contains the
   * presentation file (*.baldr).
   */
  constructor(parentPath) {

    /**
     * @type string
     */
    this.parentPath = parentPath;

    /**
     * @type Object
     */
    this.types = {
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
   * the object “this.types”. An extension should be
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
      this.types[extensions]
    ) {
      return this.types[extensions];
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
      return path.resolve(this.parentPath, filePath);
    }
  }

  /**
   * @param {string} inputPath The path of a file
   * @param {array|string} extensions A array of extensions or
   * a single extension specifed as a string or a property of
   * the object “this.types”. An extension should be
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
   * @param {array} fileList An array of file paths
   * @return {object}
   */
  groupByTypes(fileList) {
    let out = {};
    for (let type of Object.keys(this.types)) {
      out[type] = fileList.filter(
        /* jshint -W083 */
        file => this.filterFile(file, this.types[type])
      )
      .map(file => new FileInfo(file));
    }
    return out;
  }

  /**
   * Scan the parent presentation folder recursively for media files.
   * @return {object}
   * <code><pre>
   * {
   *   "audio": [
   *     {
   *       "path": "/home/baldr/test/files/media/audio/beethoven.mp3",
   *       "basename": "beethoven.mp3",
   *       "extension": "mp3",
   *       "title": "beethoven.mp3"
   *     }
   *   ],
   *   "image": [
   *     {
   *       "path": "/home/baldr/test/files/media/image/beethoven.jpg",
   *       "basename": "beethoven.jpg",
   *       "extension": "jpg",
   *       "title": "Ludwig van Beethoven",
   *       "profession": "Composer"
   *     },
   *     {
   *       "path": "/home/baldr/test/files/media/image/haydn.jpg",
   *       "basename": "haydn.jpg",
   *       "extension": "jpg",
   *       "title": "Joseph Haydn"
   *     }
   *   ]
   * }
   * </pre></code>
   */
  getMedia() {
    return this.groupByTypes(
      this.listRecursively(this.parentPath)
    );
  }

  /**
   * List all files in a directory in Node.js recursively in a
   * synchronous fashion.
   *
   * @param {string} folder Relative or absolute path of a folder.
   * @param {array} fileList An array of file paths
   * @return {array} An array of file paths
   *
   * @see https://gist.github.com/kethinov/6658166
   */
  listRecursively(folder, filelist) {
    let files = fs.readdirSync(folder).sort();
    filelist = filelist || [];
    files.forEach((file) => {
      let filePath = path.resolve(folder, file);
      if (fs.statSync(filePath).isDirectory()) {
        filelist = this.listRecursively(filePath, filelist);
      }
      else {
        filelist.push(filePath);
      }
    });
    return filelist;
  }

  /**
   * @param {string} inputPath Relative or absolute path of a folder or
   * a file.
   * @param {array|string} extensions A array of extensions or
   * a single extension specifed as a string or a property of
   * the object “this.types”. An extension should be
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
      return [new FileInfo(absPath)];
    }
    else if (stat.isDirectory()) {
      return this.listRecursively(absPath)
        .filter((file) => {
          return this.filterFile(file, extensions);
        })
        .map((file) => {
          return new FileInfo(file);
        });
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
   * the object “this.types”. An extension should be
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

exports.FileInfo = FileInfo;
exports.Media = Media;
