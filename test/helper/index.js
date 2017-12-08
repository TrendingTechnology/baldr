/**
 * @file Helper module for unit testing baldr.
 * @module baldr-test
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const {JSDOM} = require('jsdom');
const rewire = require('rewire');
const {getConfig} = require('baldr-library');
const {Environment} = require('baldr-application');

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

const {getMasters} = exports.requireFile('app', 'masters.js');

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
  'video',
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
exports.makeDOM = function(html) {
  return new JSDOM(html).window.document;
};

/**
 *
 */
exports.document = exports.makeDOM(
  fs.readFileSync(
    path.join(__dirname, '..', '..', 'render.html'),
    'utf8'
  )
);

/**
 *
 */
exports.getDOM = function() {
  return exports.makeDOM(
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
exports.freshEnv = function() {
  return new Environment([exports.testFileMinimal], exports.getDOM());
};

/**
 *
 */
exports.env = exports.freshEnv();

/**
 *
 */
exports.config = getConfig([exports.testFileMinimal]);
exports.cloneConfig = function () {
  return Object.assign({}, exports.config);
};

/**
 *
 */
exports.masters = getMasters(exports.document);

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
