/* jshint esversion: 6 */

const assert = require('assert');
const path = require('path');
const fs = require('fs');
const sleep = require('sleep');

const rewire = require("rewire");
var slu = rewire("../index.js");
slu.bootstrapConfig({path: path.resolve('songs')});

describe('Configuration', function() {
  const config = slu.__get__("config");

  describe('default configuration', function() {
    it('"config.json" should return "songs.json"', function() {
      assert.equal(config.json, "songs.json");
    });
    it('"config.info" should return "info.json"', function() {
      assert.equal(config.info, "info.json");
    });
    it('"config.mtime" should return ".mtime"', function() {
      assert.equal(config.mtime, ".mtime");
    });
  });

  it('"bootstrapConfig()', function() {
    var s = rewire("../index.js");
    s.bootstrapConfig({path: 'lol'});
    const c = s.__get__("config");
    assert.equal(c.path, 'lol');
    assert.equal(c.json, "songs.json");
  });
});

describe('Functions', function() {
  it('"getMscoreCommand()" should return "mscore"', function() {
    const getMscoreCommand = slu.__get__("getMscoreCommand");
    assert.equal(getMscoreCommand(), "mscore");
  });

  it('"generatePDF()"', function() {
    const generatePDF = slu.__get__("generatePDF");
    const folder = path.join('songs', 'Swing-low');
    generatePDF(folder, 'projector', 'projector');
    assert.ok(fs.existsSync(path.join(folder, 'projector.pdf')));
  });

  it('"deleteFile()"', function() {
    const deleteFile = slu.__get__("deleteFile");
    const folder = path.join('songs', 'Swing-low');
    const fileName = 'test.txt';
    const file = path.join(folder, fileName);
    fs.appendFileSync(file, 'test');
    assert.ok(fs.existsSync(file));
    deleteFile(folder, fileName);
    assert.ok(!fs.existsSync(file));
  });

  it('"pull()"', function() {
    var pull = slu.__get__("pull");
    assert.ok(!pull());
  });

  it('"fileChanged()" run once', function() {
    var fileChanged = slu.__get__("fileChanged");
    fs.appendFileSync('tmp.txt', 'test');
    assert.ok(fileChanged('tmp.txt'));
    fs.unlinkSync('tmp.txt');
  });

  it('"fileChanged()" run twice', function() {
    var fileChanged = slu.__get__("fileChanged");
    sleep.msleep(10);
    fs.appendFileSync('tmp.txt', 'test');
    assert.ok(fileChanged('tmp.txt'));
    assert.ok(!fileChanged('tmp.txt'));
    fs.unlinkSync('tmp.txt');
  });

  it('"getFolders()"', function() {
    var getFolders = slu.__get__("getFolders");
    var folders = getFolders();
    assert.equal(folders.length, 3);
  });

  it('"generateJSON()"', function() {
    slu.generateJSON();
  });

  it('"deleteFilesInFolder()"', function() {
    var deleteFilesInFolder = slu.__get__("deleteFilesInFolder");
    fs.mkdirSync('tmp');
    fs.appendFileSync(path.join('tmp', 't.txt'), 'test');
    fs.appendFileSync(path.join('tmp', 't2.txt'), 'test');
    deleteFilesInFolder('tmp');
    assert.ok(!fs.existsSync(path.join('tmp', 't.txt')))
    assert.ok(!fs.existsSync(path.join('tmp', 't2.txt')))
    fs.rmdirSync('tmp');
  });

});
