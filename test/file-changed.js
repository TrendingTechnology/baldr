/* jshint esversion: 6 */

const assert = require('assert');
const path = require('path');
const p = path.join;
const fs = require('fs-extra');
const sleep = require('sleep');

const fileChanged = require('../file-changed.js');

const rewire = require('rewire');

var rewireScript = function() {
  script = rewire('../index.js');
  script.bootstrapConfig({
    test: true,
    path: path.resolve('songs'),
    force: true,
  });
  return script;
}

before(function() {
  process.env.PATH = __dirname + '/bin:' + process.env.PATH;
});

describe('file-changed.js', () => {
  describe('Object', () => {

    it('"db.initialize()"', () => {
      let db = new fileChanged.Sqlite('test.db');
      db.initialize();
      assert.exists('test.db');
      fs.unlinkSync('test.db');
    });

    it('"db.insert()"', () => {
      let db = new fileChanged.Sqlite('test.db');
      db.initialize();
      db.insert('lol', 'toll');
      var row = db.select('lol');
      assert.equal(row.hash, 'toll');
      fs.unlinkSync('test.db');
    });

    it('"db.update()"', () => {
      let db = new fileChanged.Sqlite('test.db');
      db.initialize();

      db.insert('lol', 'toll');
      assert.equal(db.select('lol').hash, 'toll');

      db.update('lol', 'troll');
      assert.equal(db.select('lol').hash, 'troll');

      fs.unlinkSync('test.db');
    });

  });

  describe('"fileChanged()"', function() {
    it('"fileChanged()": run once', function() {
      var slu = rewireScript();
      var fileChanged = slu.__get__('fileChanged');
      fs.appendFileSync('tmp.txt', 'test');
      assert.ok(fileChanged('tmp.txt'));
      fs.unlinkSync('tmp.txt');
      slu.clean();
    });

    it('"fileChanged()": run twice', function() {
      var slu = rewireScript();
      var fileChanged = slu.__get__('fileChanged');
      fs.appendFileSync('tmp.txt', 'test');
      assert.ok(fileChanged('tmp.txt'));
      assert.ok(!fileChanged('tmp.txt'));
      fs.unlinkSync('tmp.txt');
      slu.clean();
    });

    it('"fileChanged()": run three times', function() {
      var slu = rewireScript();
      var fileChanged = slu.__get__('fileChanged');
      fs.appendFileSync('tmp.txt', 'test');
      assert.ok(fileChanged('tmp.txt'));
      assert.ok(!fileChanged('tmp.txt'));
      assert.ok(!fileChanged('tmp.txt'));
      fs.unlinkSync('tmp.txt');
      slu.clean();
    });

    it('"fileChanged()": change file', function() {
      var slu = rewireScript();
      var fileChanged = slu.__get__('fileChanged');
      fs.appendFileSync('tmp.txt', 'test');
      assert.ok(fileChanged('tmp.txt'));
      assert.ok(!fileChanged('tmp.txt'));
      fs.appendFileSync('tmp.txt', 'test');
      assert.ok(fileChanged('tmp.txt'));
      fs.unlinkSync('tmp.txt');
      slu.clean();
    });

    it('"fileChanged()": nonexisting file', function() {
      var slu = rewireScript();
      var fileChanged = slu.__get__('fileChanged');
      assert.ok(!fileChanged('tmxxxxxxxxxxxxxxxxxxxxxxp.txt'));
      slu.clean();
    });

    it('"fileChanged()": in folder', function() {
      var slu = rewireScript();
      var fileChanged = slu.__get__('fileChanged');
      var tmp = p('songs', 'tmp.txt')
      fs.appendFileSync(tmp, 'test');
      assert.ok(fileChanged(tmp));
      assert.ok(!fileChanged(tmp));
      fs.unlinkSync(tmp);
      slu.clean();
    });

    it('"fileChanged()": absolute path', function() {
      var slu = rewireScript();
      var fileChanged = slu.__get__('fileChanged');
      var tmp = path.resolve('tmp.txt')
      fs.appendFileSync(tmp, 'test');
      assert.ok(fileChanged(tmp));
      assert.ok(!fileChanged(tmp));
      fs.unlinkSync(tmp);
      slu.clean();
    });
  });
});
