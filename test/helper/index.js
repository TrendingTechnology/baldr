/**
 * @file Helper module for unit testing baldr.
 * @module baldr-test
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const {JSDOM} = require('jsdom');
const rewire = require('rewire');
const {getMasters} = require('baldr-application');
const {getConfig} = require('baldr-library');

/**
 *
 */
exports.assert = assert;

/**
 *
 */
exports.fs = fs;

/**
 *
 */
exports.path = path;

/**
 *
 */
exports.rewire = rewire;

/**
 *
 */
exports.allMasters = [
  'audio',
  'camera',
  'editor',
  'image',
  'markdown',
  'person',
  'question',
  'quote',
  'svg',
  'website'
];

/**
 *
 */
exports.allThemes = [
  'default',
  'handwriting'
];

/**
 *
 */
let makeDOM = function(html) {
  return new JSDOM(html).window.document;
};

/**
 *
 */
exports.document = makeDOM(
  fs.readFileSync(
    path.join(__dirname, '..', '..', 'render.html'),
    'utf8'
  )
);

/**
 *
 */
exports.getDOM = function() {
  return makeDOM(
    fs.readFileSync(
      path.join(__dirname, '..', '..', 'render.html'),
      'utf8'
    )
  );
};

/**
 *
 */
exports.testFileMinimal = path.resolve('test', 'files', 'minimal.baldr');

/**
 *
 */
exports.config = getConfig([exports.testFileMinimal]);

/**
 *
 */
exports.masters = getMasters();

/**
 *
 */
exports.srcPath = function() {
  return path.join(__dirname, '..', '..', 'src', ...arguments);
};

/**
 *
 */
exports.requireFile = function() {
  return require(exports.srcPath(...arguments));
};

/**
 *
 */
class Spectron {

  /**
   *
   */
  constructor(baldrFile) {
    if (process.platform === 'linux') {
      this.appPath = 'dist/linux-unpacked/baldr';
    }
    else if (process.platform === 'darwin') {
      this.appPath = 'dist/mac/baldr.app/Contents/MacOS/baldr';
    }
    let {Application} = require('spectron');
    let config = {
      path: this.appPath
    };
    if (baldrFile) config.args = [baldrFile];
    this.app = new Application(config);
  }

  /**
   *
   */
  getApp() {
    return this.app;
  }

  /**
   *
   */
  start() {
    return this.app.start();
  }

  /**
   *
   */
  stop() {
    if (this.app && this.app.isRunning()) {
      return this.app.stop();
    }
  }
}

exports.Spectron = Spectron;
