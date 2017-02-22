/* jshint esversion: 6 */

const assert = require('assert');
const path = require('path');
const p = path.join;
const fs = require('fs-extra');
const sleep = require('sleep');

const rewire = require("rewire");
var slu = rewire("../index.js");
slu.bootstrapConfig({
  test: true,
  path: path.resolve('songs'),
  force: true,
});

exists = function() {
  assert.ok(fs.existsSync(path.join.apply(null, arguments)));
};

describe('Configuration', function() {
  const config = slu.__get__("config");

  describe('default configuration', function() {
    it('"config.json" should return "songs.json"', function() {
      assert.equal(config.json, "songs.json");
    });
    it('"config.info" should return "info.json"', function() {
      assert.equal(config.info, "info.json");
    });
  });

  it('"bootstrapConfig()', function() {
    var s = rewire("../index.js");
    s.bootstrapConfig({path: 'lol', test: true});
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
    var json = p('songs', 'songs.json');
    exists(json);
    fs.removeSync(json);
  });

  it('"generateSlides()"', function() {
    var generatePDF = slu.__get__("generatePDF");
    var generateSlides = slu.__get__("generateSlides");
    generatePDF('Swing-low', 'projector');
    const folder = p('songs', 'Swing-low');
    const slides = p (folder, 'slides');
    generateSlides(folder);
    exists(slides, '01.svg');
    exists(slides, '02.svg');
    exists(slides, '03.svg');
    exists(slides, '04.svg');
    fs.removeSync(slides);
  });

  it('"generatePianoEPS(): lead"', function() {
    var generatePianoEPS = slu.__get__("generatePianoEPS");
    const folder = p('songs', 'Swing-low');
    generatePianoEPS(folder);
    exists(folder, 'piano');
    exists(folder, 'piano', 'piano.mscx');
    exists(folder, 'piano', 'piano.eps');
    fs.removeSync(p(folder, 'piano'));
  });

  it('"generatePianoEPS(): piano"', function() {
    var generatePianoEPS = slu.__get__("generatePianoEPS");
    const folder = p('songs', 'Auf-der-Mauer_auf-der-Lauer');
    generatePianoEPS(folder);
    exists(folder, 'piano');
    exists(folder, 'piano', 'piano.mscx');
    exists(folder, 'piano', 'piano.eps');
    fs.removeSync(p(folder, 'piano'));

  });

  it('"generatePianoEPS(): multipage"', function() {
    var generatePianoEPS = slu.__get__("generatePianoEPS");
    const folder = p('songs', 'Zum-Tanze-da-geht-ein-Maedel');
    generatePianoEPS(folder);
    exists(folder, 'piano');
    exists(folder, 'piano', 'piano.mscx');
    exists(folder, 'piano', 'piano_1.eps');
    fs.removeSync(p(folder, 'piano'));
  });

  it('"message()"', function() {
    var message = slu.__get__("message");
    assert.equal(message('test'), 'test');
  });

  it('"update()"', function() {
    slu.update();
    var config = slu.__get__('config');
    const auf = p('songs', 'Auf-der-Mauer_auf-der-Lauer');
    const swing = p('songs', 'Swing-low');
    const zum = p('songs', 'Zum-Tanze-da-geht-ein-Maedel');
    const folders = [auf, swing, zum];

    for (i = 0; i < folders.length; ++i) {
      exists(folders[i], 'slides');
      exists(folders[i], 'slides', '01.svg');
      exists(folders[i], 'piano');
      exists(folders[i], 'piano', 'piano.mscx');
    }

    exists(auf, 'piano', 'piano.eps');
    exists(swing, 'piano', 'piano.eps');
    exists(zum, 'piano', 'piano_1.eps');
    exists(zum, 'piano', 'piano_2.eps');
    exists(zum, 'piano', 'piano_3.eps');

    var info = JSON.parse(fs.readFileSync(p(config.path, 'songs.json'), 'utf8'));
    assert.equal(info[Object.keys(info)[0]].title, 'Auf der Mauer, auf der Lauer');

    slu.clean();
  });

  it('"checkExecutable()": existing executable', function() {
    var checkExecutable = slu.__get__("checkExecutable");
    var check = checkExecutable('echo');
    assert.equal(check, undefined);
  });

  it('"checkExecutable()": nonexisting executable', function() {
    var checkExecutable = slu.__get__("checkExecutable");
    var check = checkExecutable('loooooool');
    assert.equal(typeof(check), 'string');
  });

  it('"messageConfigFile()"', function() {
    var messageConfigFile = slu.__get__("messageConfigFile");
    var output = messageConfigFile();
    assert.ok(output.length > 100);
  });

  it('"getSongInfo()"', function() {
    var getSongInfo = slu.__get__("getSongInfo");
    const config = slu.__get__("config");
    var info = getSongInfo(p(config.path, 'Swing-low'));
    assert.equal(info.title, 'Swing low');
  });

  it('"generateTeX()"', function() {
    slu.generateTeX();
    const config = slu.__get__("config");
    exists(config.path, config.tex);
  });

});
