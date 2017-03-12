/* jshint esversion: 6 */

const assert = require('assert');
const path = require('path');
const p = path.join;
const fs = require('fs-extra');
const sleep = require('sleep');

const rewire = require('rewire');
var slu = rewire('../index.js');
slu.bootstrapConfig({
  test: true,
  path: path.resolve('songs'),
  force: true,
});

exists = function() {
  assert.ok(fs.existsSync(path.join.apply(null, arguments)));
};

var assertGenerateTeX = function() {
  const config = slu.__get__('config');
  const tex = p(config.path, config.tex);
  exists(tex);
  var texContents = fs.readFileSync(tex, 'utf8');

  assert.ok(texContents.indexOf('\\tmpimage') > -1);
  assert.ok(texContents.indexOf('\\tmpheading') > -1);
};

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
    s.bootstrapConfig({path: 'lol', test: true});
    const c = s.__get__('config');
    assert.equal(c.path, 'lol');
    assert.equal(c.json, 'songs.json');
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
    const folder = p('songs', 'Swing-low');
    generatePDF(folder, 'projector', 'projector');
    exists(folder, 'projector.pdf');
  });

  it('"pull()"', function() {
    var pull = slu.__get__('pull');
    assert.ok(!pull());
  });

  describe('"fileChanged()"', function() {
    it('"fileChanged()": run once', function() {
      var fileChanged = slu.__get__('fileChanged');
      fs.appendFileSync('tmp.txt', 'test');
      assert.ok(fileChanged('tmp.txt'));
      fs.unlinkSync('tmp.txt');
    });

    it('"fileChanged()": run twice', function() {
      this.slow(4000);
      var fileChanged = slu.__get__('fileChanged');
      sleep.msleep(1000);
      fs.appendFileSync('tmp.txt', 'test');
      assert.ok(fileChanged('tmp.txt'));
      assert.ok(!fileChanged('tmp.txt'));
      fs.unlinkSync('tmp.txt');
    });
  });

  it('"getFolders()"', function() {
    var getFolders = slu.__get__('getFolders');
    var folders = getFolders();
    assert.equal(folders.length, 3);
  });

  it('"generateSlides()"', function() {
    this.timeout(0);
    this.slow(10000);
    var generatePDF = slu.__get__('generatePDF');
    var generateSlides = slu.__get__('generateSlides');
    var config = slu.__get__('config');
    generatePDF('Swing-low', 'projector');
    const folder = p('songs', 'Swing-low');
    const slides = p (folder, config.slidesFolder);
    generateSlides(folder);
    exists(slides, '01.svg');
    exists(slides, '02.svg');
    fs.removeSync(slides);
  });

  describe('"generatePianoEPS()"', function() {
    it('"generatePianoEPS()": lead', function() {
      this.timeout(0);
      this.slow(10000);
      var generatePianoEPS = slu.__get__('generatePianoEPS');
      var config = slu.__get__('config');
      const folder = p('songs', 'Swing-low');
      generatePianoEPS(folder);
      exists(folder, config.pianoFolder);
      exists(folder, config.pianoFolder, 'piano.mscx');
      exists(folder, config.pianoFolder, 'piano.eps');
      fs.removeSync(p(folder, config.pianoFolder));
    });

    it('"generatePianoEPS()": piano', function() {
      this.timeout(0);
      this.slow(10000);
      var generatePianoEPS = slu.__get__('generatePianoEPS');
      var config = slu.__get__('config');
      const folder = p('songs', 'Auf-der-Mauer_auf-der-Lauer');
      generatePianoEPS(folder);
      exists(folder, config.pianoFolder);
      exists(folder, config.pianoFolder, 'piano.mscx');
      exists(folder, config.pianoFolder, 'piano.eps');
      fs.removeSync(p(folder, config.pianoFolder));

    });

    it('"generatePianoEPS()": multipage', function() {
      this.timeout(0);
      this.slow(16000);
      var generatePianoEPS = slu.__get__('generatePianoEPS');
      var config = slu.__get__('config');
      const folder = p('songs', 'Zum-Tanze-da-geht-ein-Maedel');
      generatePianoEPS(folder);
      exists(folder, config.pianoFolder);
      exists(folder, config.pianoFolder, 'piano.mscx');
      exists(folder, config.pianoFolder, 'piano_1.eps');
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

  it('"getSongInfo()"', function() {
    var getSongInfo = slu.__get__('getSongInfo');
    const config = slu.__get__('config');
    var info = getSongInfo(p(config.path, 'Swing-low'));
    assert.equal(info.title, 'Swing low');
  });

  describe('"getFolderFiles()"', function() {

    it('"getFolderFiles()": eps', function() {
      const getFolderFiles = slu.__get__('getFolderFiles');
      const files = getFolderFiles(p('test', 'piano-files'), '.eps');
      assert.deepEqual(files, ['01.eps', '02.eps', '03.eps']);
    });

    it('"getFolderFiles()": svg', function() {
      const getFolderFiles = slu.__get__('getFolderFiles');
      const files = getFolderFiles(p('test', 'slides-files'), '.svg');
      assert.deepEqual(files, ['01.svg', '02.svg', '03.svg']);
    });

    it('"getFolderFiles()": non existent folder', function() {
      const getFolderFiles = slu.__get__('getFolderFiles');
      const files = getFolderFiles(p('test', 'lol'), '.svg');
      assert.deepEqual(files, []);
    });

    it('"getFolderFiles()": empty folder', function() {
      const getFolderFiles = slu.__get__('getFolderFiles');
      fs.mkdirSync(p('test', 'empty'));
      const files = getFolderFiles(p('test', 'empty'), '.svg');
      assert.deepEqual(files, []);
      fs.rmdirSync(p('test', 'empty'));
    });
  });

});

/**
 *
 */
describe('Exported functions', function() {

  it('"generateJSON()"', function() {
    slu.generateJSON();
    var json = p('songs', 'songs.json');
    exists(json);
    fs.removeSync(json);
  });

  it('"update()"', function() {
    this.timeout(0);
    this.slow(50000);
    slu.update();
    var config = slu.__get__('config');
    const auf = p('songs', 'Auf-der-Mauer_auf-der-Lauer');
    const swing = p('songs', 'Swing-low');
    const zum = p('songs', 'Zum-Tanze-da-geht-ein-Maedel');
    const folders = [auf, swing, zum];

    for (i = 0; i < folders.length; ++i) {
      exists(folders[i], config.slidesFolder);
      exists(folders[i], config.slidesFolder, '01.svg');
      exists(folders[i], config.pianoFolder);
      exists(folders[i], config.pianoFolder, 'piano.mscx');
    }

    exists(auf, config.pianoFolder, 'piano.eps');
    exists(swing, config.pianoFolder, 'piano.eps');
    exists(zum, config.pianoFolder, 'piano_1.eps');
    exists(zum, config.pianoFolder, 'piano_2.eps');

    var info = JSON.parse(fs.readFileSync(p(config.path, 'songs.json'), 'utf8'));
    assert.equal(info[Object.keys(info)[0]].title, 'Auf der Mauer, auf der Lauer');

    slu.clean();
  });

  it('"generateTeX()"', function() {
    this.timeout(0);
    this.slow(40000);
    const getFolders = slu.__get__('getFolders');
    const generatePianoEPS = slu.__get__('generatePianoEPS');
    getFolders().forEach((folder) => {
      generatePianoEPS(folder);
    });
    slu.generateTeX();
    assertGenerateTeX();
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
  it('--tex', function() {
    this.timeout(0);
    this.slow(50000);
    const cli = spawn('./command.js', ['--test', '--tex']);
    assertGenerateTeX();
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
