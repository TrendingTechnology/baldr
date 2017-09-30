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

before(function() {
  process.env.PATH = __dirname + '/bin:' + process.env.PATH;
});

/**
 *
 */
describe('Configuration', function() {
  const config = slu.__get__('config');

  describe('default configuration', function() {
    it('"config.json" should return "songs.json"', function() {
      assert.equal(config.json, 'songs.json');
    });
    it('"config.info" should return "info.json"', function() {
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

  it('const alphabet', function() {
      const alphabet = slu.__get__('alphabet');
      assert.equal(alphabet[0], 0);
      assert.equal(alphabet[26], 'z');
  });
});

/**
 *
 */
describe('Private functions', function() {

  it('"getMscoreCommand()"', function() {
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

  it('"pull()"', function() {
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

  describe('"generatePianoEPS()"', function() {
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

  it('"message()"', function() {
    var message = slu.__get__('message');
    assert.equal(message('test'), 'test');
  });

  describe('"checkExecutable()"', function() {
    it('"checkExecutable()": existing executable', function() {
      var checkExecutable = slu.__get__('checkExecutable');
      var check = checkExecutable('echo');
      assert.equal(check, undefined);
    });

    it('"checkExecutable()": nonexisting executable', function() {
      var checkExecutable = slu.__get__('checkExecutable');
      var check = checkExecutable('loooooool');
      assert.equal(typeof(check), 'string');
    });
  });

  it('"messageConfigFile()"', function() {
    var messageConfigFile = slu.__get__('messageConfigFile');
    var output = messageConfigFile();
    assert.ok(output.length > 100);
  });

});

/**
 *
 */
describe('Exported functions', function() {

  it('"generateJSON()"', function() {
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

  it('"setTestMode()"', function() {
    slu.setTestMode();
    const config = slu.__get__('config');
    assert.equal(config.test, true);
    assert.equal(config.path, path.resolve('./songs'));
  });

  it('"clean()"', function() {
    slu.clean();
    assert.ok(!fs.existsSync(p('songs', 'songs.tex')));
  });

});

describe('Command line', function() {
  const spawn = require('child_process').spawnSync;

  it('no arguments: normal update', function() {
    this.timeout(0);
    this.slow(50000);
    const cli = spawn('./command.js', ['--test']);
  });

  it('no arguments (second run): only json and TeX generation', function() {
    this.timeout(0);
    this.slow(1000);
    const cli = spawn('./command.js', ['--test']);
  });

  it('--force', function() {
    this.timeout(0);
    this.slow(50000);
    const cli = spawn('./command.js', ['--test', '--force']);
  });

  // After --force
  it('--json', function() {
    this.timeout(0);
    this.slow(50000);
    const cli = spawn('./command.js', ['--test', '--json']);
  });

  // After --force
  it.skip('--tex', function() {
    this.timeout(0);
    this.slow(50000);
    const cli = spawn('./command.js', ['--test', '--tex']);
    assertGenerateTeX();
  });

  it.skip('--folder', function() {
    const config = slu.__get__('config');
    const cli = spawn('./command.js', ['--test', '--folder', 'Swing-low']);
    assert.exists('Swing-low', config.pianoFolder, 'piano.eps');
  });

  it('--help', function() {
    this.slow(1000);
    const cli = spawn('./command.js', ['--test', '--help']);
    var out = cli.stdout.toString();
    assert.ok(out.indexOf('Usage') > -1);
    assert.ok(out.indexOf('--help') > -1);
    assert.ok(out.indexOf('--version') > -1);
    assert.equal(cli.status, 0);
  });

  it('--version', function() {
    this.slow(1000);
    const cli = spawn('./command.js', ['--test', '--version']);
    assert.equal(cli.stdout.toString(), '0.0.5\n');
    assert.equal(cli.status, 0);
  });

  // Test should be executed at the very last position.
  it('--clean', function() {
    this.slow(50000);
    const cli = spawn('./command.js', ['--test', '--clean']);
  });
});
