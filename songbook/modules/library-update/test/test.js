/* jshint esversion: 6 */

const assert = require('assert');
const path = require('path');
const p = path.join
const fs = require('fs-extra');
const sleep = require('sleep');

const rewire = require("rewire");
var slu = rewire("../index.js");
slu.bootstrapConfig({
  test: true,
  path: path.resolve('songs')
});

exists = function() {
  assert.ok(fs.existsSync(path.join.apply(null, arguments)));
}

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
  this.timeout(0);
  this.slow(10000);
  it('"getMscoreCommand()" should return "mscore"', function() {
    const getMscoreCommand = slu.__get__("getMscoreCommand");
    assert.equal(getMscoreCommand(), "mscore");
  });

  it('"generatePDF()"', function() {
    const generatePDF = slu.__get__("generatePDF");
    const folder = p('songs', 'Swing-low');
    generatePDF(folder, 'projector', 'projector');
    exists(folder, 'projector.pdf');
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

  it('"generateSlides()"', function() {
    var generatePDF = slu.__get__("generatePDF");
    var generateSlides = slu.__get__("generateSlides");
    generatePDF('Swing-low', 'projector');
    generateSlides(p('songs', 'Swing-low'));
    exists('songs', 'Swing-low', 'slides', '01.svg');
  });

  it('"generatePianoEPS(): lead"', function() {
    var generatePianoEPS = slu.__get__("generatePianoEPS");
    const swing = p('songs', 'Swing-low');
    generatePianoEPS(swing);
    exists(swing, 'piano');
    exists(swing, 'piano', 'piano.mscx');
    exists(swing, 'piano', 'piano.eps');
    fs.removeSync(p(swing, 'piano'));
  });

  it('"generatePianoEPS(): piano"', function() {
    var generatePianoEPS = slu.__get__("generatePianoEPS");
    const auf = p('songs', 'Auf-der-Mauer_auf-der-Lauer');
    generatePianoEPS(auf);
    exists(auf, 'piano');
    exists(auf, 'piano', 'piano.mscx');
    exists(auf, 'piano', 'piano.eps');
    fs.removeSync(p(auf, 'piano'));

  });

  it('"generatePianoEPS(): multipage"', function() {
    var generatePianoEPS = slu.__get__("generatePianoEPS");
    const zum = p('songs', 'Zum-Tanze-da-geht-ein-Maedel');
    generatePianoEPS(zum);
    exists(zum, 'piano');
    exists(zum, 'piano', 'piano.mscx');
    exists(zum, 'piano', 'piano_1.eps');
    fs.removeSync(p(zum, 'piano'));
  });

  it('"message()"', function() {
    var message = slu.__get__("message");
    assert.equal(message('test'), 'test');
  });

});
