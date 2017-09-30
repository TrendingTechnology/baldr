/* jshint esversion: 6 */

const {assert} = require('./lib/helper.js');
const path = require('path');
const p = path.join;
const fs = require('fs-extra');
const sleep = require('sleep');
const process = require('process');
const rewire = require('rewire');

var slu = rewire('../index.js');
slu.bootstrapConfig({
  test: true,
  path: path.resolve('songs'),
  force: true,
});

before(() => {
  process.env.PATH = __dirname + '/bin:' + process.env.PATH;
});

/**
 *
 */
describe('Configuration', () => {
  const config = slu.__get__('config');

  describe('default configuration', () => {
    it('"config.json" should return "songs.json"', () => {
      assert.equal(config.json, 'songs.json');
    });
    it('"config.info" should return "info.json"', () => {
      assert.equal(config.info, 'info.json');
    });
  });

  it('"bootstrapConfig()"', function() {
    this.slow(1000);
    var s = rewire('../index.js');
    s.bootstrapConfig({path: path.resolve('songs'), test: true});
    const c = s.__get__('config');
    assert.equal(c.path, path.resolve('songs'));
    assert.equal(c.json, 'songs.json');
    assert.exists(path.resolve('songs', 'filehashes.db'))
  });

});

/**
 *
 */
describe('Private functions', () => {

  it('"getMscoreCommand()"', () => {
    const getMscoreCommand = slu.__get__('getMscoreCommand');
    if (process.platform == 'darwin') {
      assert.equal(getMscoreCommand(), '/Applications/MuseScore 2.app/Contents/MacOS/mscore');
    }
    else {
      assert.equal(getMscoreCommand(), 'mscore');
    }
  });

  it('"generatePDF()"', function() {
    this.timeout(0);
    this.slow(10000);
    const generatePDF = slu.__get__('generatePDF');
    const folder = p('songs', 's', 'Swing-low');
    generatePDF(folder, 'projector', 'projector');
    assert.exists(folder, 'projector.pdf');
  });

  it('"pull()"', () => {
    var pull = slu.__get__('pull');
    assert.ok(!pull());
  });

  it('"generateSlides()"', function() {
    this.timeout(0);
    this.slow(10000);
    var generatePDF = slu.__get__('generatePDF');
    var generateSlides = slu.__get__('generateSlides');
    var config = slu.__get__('config');
    generatePDF('s', 'Swing-low', 'projector');
    const folder = p('songs', 's', 'Swing-low');
    const slides = p (folder, config.slidesFolder);
    generateSlides(folder);
    assert.exists(slides, '01.svg');
    assert.exists(slides, '02.svg');
    fs.removeSync(slides);
  });

  describe('"generatePianoEPS()"', () => {
    it('"generatePianoEPS()": lead', function() {
      this.timeout(0);
      this.slow(10000);
      var generatePianoEPS = slu.__get__('generatePianoEPS');
      var config = slu.__get__('config');
      const folder = p('songs', 's', 'Swing-low');
      generatePianoEPS(folder);
      assert.exists(folder, config.pianoFolder);
      assert.exists(folder, config.pianoFolder, 'piano.mscx');
      assert.exists(folder, config.pianoFolder, 'piano_1.eps');
      fs.removeSync(p(folder, config.pianoFolder));
    });

    it('"generatePianoEPS()": piano', function() {
      this.timeout(0);
      this.slow(10000);
      var generatePianoEPS = slu.__get__('generatePianoEPS');
      var config = slu.__get__('config');
      const folder = p('songs', 'a', 'Auf-der-Mauer_auf-der-Lauer');
      generatePianoEPS(folder);
      assert.exists(folder, config.pianoFolder);
      assert.exists(folder, config.pianoFolder, 'piano.mscx');
      assert.exists(folder, config.pianoFolder, 'piano_1.eps');
      fs.removeSync(p(folder, config.pianoFolder));
    });

  });

  it('"message()"', () => {
    var message = slu.__get__('message');
    assert.equal(message('test'), 'test');
  });

  describe('"checkExecutable()"', () => {
    it('"checkExecutable()": existing executable', () => {
      var checkExecutable = slu.__get__('checkExecutable');
      var check = checkExecutable('echo');
      assert.equal(check, undefined);
    });

    it('"checkExecutable()": nonexisting executable', () => {
      var checkExecutable = slu.__get__('checkExecutable');
      var check = checkExecutable('loooooool');
      assert.equal(typeof(check), 'string');
    });
  });

  it('"messageConfigFile()"', () => {
    var messageConfigFile = slu.__get__('messageConfigFile');
    var output = messageConfigFile();
    assert.ok(output.length > 100);
  });

});

/**
 *
 */
describe('Exported functions', () => {

  it('"generateJSON()"', () => {
    slu.generateJSON();
    var json = path.join('songs', 'songs.json');
    assert.exists(json);
    var structure = JSON.parse(fs.readFileSync(json, 'utf8'));
    assert.equal(
      structure.a['Auf-der-Mauer_auf-der-Lauer'].title,
      'Auf der Mauer, auf der Lauer'
    );
    fs.removeSync(json);
  });

  it('"update()"', function() {
    this.timeout(0);
    this.slow(50000);
    slu.update();
    var config = slu.__get__('config');
    const auf = p('songs', 'a', 'Auf-der-Mauer_auf-der-Lauer');
    const swing = p('songs', 's', 'Swing-low');
    const zum = p('songs', 'z', 'Zum-Tanze-da-geht-ein-Maedel');
    const folders = [auf, swing, zum];

    for (i = 0; i < folders.length; ++i) {
      assert.exists(folders[i], config.slidesFolder);
      assert.exists(folders[i], config.slidesFolder, '01.svg');
      assert.exists(folders[i], config.pianoFolder);
      assert.exists(folders[i], config.pianoFolder, 'piano.mscx');
    }

    assert.exists(auf, config.pianoFolder, 'piano_1.eps');
    assert.exists(swing, config.pianoFolder, 'piano_1.eps');
    assert.exists(zum, config.pianoFolder, 'piano_1.eps');
    assert.exists(zum, config.pianoFolder, 'piano_2.eps');

    var info = JSON.parse(fs.readFileSync(p(config.path, 'songs.json'), 'utf8'));
    assert.equal(
      info.a['Auf-der-Mauer_auf-der-Lauer'].title,
      'Auf der Mauer, auf der Lauer'
    );

    slu.clean();
  });

  it('"setTestMode()"', () => {
    slu.setTestMode();
    const config = slu.__get__('config');
    assert.equal(config.test, true);
    assert.equal(config.path, path.resolve('./songs'));
  });

  it('"clean()"', () => {
    slu.clean();
    assert.ok(!fs.existsSync(p('songs', 'songs.tex')));
  });

});
