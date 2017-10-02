/* jshint esversion: 6 */

const assert = require('assert');
const path = require('path');
const p = path.join;
const fs = require('fs-extra');
const sleep = require('sleep');

const fileChanged = require('../file-changed.js');

const rewire = require('rewire');
const rw = require('rewire')('../file-changed.js');


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

  it('"Object Sqlite()"', () => {
    let db = new fileChanged.Sqlite('test.db');
    db.initialize();
    assert.exists('test.db');

    db.insert('lol', 'toll');
    var row = db.select('lol');
    assert.equal(row.hash, 'toll');

    let error = db.insert('lol', 'toll');
    assert.equal(error.name, 'SqliteError');

    db.update('lol', 'troll');
    assert.equal(db.select('lol').hash, 'troll');

    fs.unlinkSync('test.db');
  });

  it('"hash()"', () => {
    let hash = rw.__get__('hash');
    assert.equal(
      hash(path.join('test', 'files', 'hash.txt')),
      '7516f3c75e85c64b98241a12230d62a64e59bce3'
    );
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
