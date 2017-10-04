const {assert} = require('./lib/helper.js');
const path = require('path');
const fs = require('fs-extra');
const process = require('process');
const sinon = require('sinon');

const index = require('../index.js');

var rewireBootstrapped = require('rewire')('../index.js');
rewireBootstrapped.bootstrapConfig({
  test: true,
  path: path.resolve('songs'),
  force: true,
});

const rewire = require('rewire')('../index.js');

process.env.PATH = __dirname + '/bin:' + process.env.PATH;


before(() => {
  process.env.PATH = __dirname + '/bin:' + process.env.PATH;
});

/**
 *
 */
describe('Configuration', () => {
  const config = rewireBootstrapped.__get__('config');

  describe('default configuration', () => {
    it('"config.json" should return "songs.json"', () => {
      assert.equal(config.json, 'songs.json');
    });
    it('"config.info" should return "info.json"', () => {
      assert.equal(config.info, 'info.json');
    });
  });

  it('"bootstrapConfig()"', () => {
    rewire.bootstrapConfig({path: path.resolve('songs'), test: true});
    const c = rewire.__get__('config');
    assert.equal(c.path, path.resolve('songs'));
    assert.equal(c.json, 'songs.json');
    assert.exists(path.resolve('songs', 'filehashes.db'));
  });

  it('"bootstrapConfig()": exit', () => {
    let savePATH = process.env.PATH;
    process.env.PATH = '';
    try {
      rewire.bootstrapConfig({path: path.resolve('songs'), test: true});
    }
    catch(e) {
      assert.equal(
        e.message,
        'Some dependencies are not installed: “mscore-to-eps.sh”, ' +
        '“pdf2svg”, “pdfcrop”, “pdfinfo”, “pdftops”, “mscore”'
      );
      assert.equal(e.name, 'UnavailableCommandsError');
    }
    process.env.PATH = savePATH;
  });

});

/**
 *
 */
describe('Private functions', () => {

  it('"message()"', () => {
    stub = sinon.stub();
    message = rewire.__get__('message');
    message = stub;
    message('lol');
    assert.equal(stub.called, true);
  });

  it('"messageConfigFile()"', () => {
    stub = sinon.stub();

    let revert = rewire.__set__('message', stub);
    messageConfigFile = rewire.__get__('messageConfigFile');

    try {
      messageConfigFile();
    }
    catch (e) {
      assert.equal(e.message, 'No configuration file found.');
    }
    assert.equal(stub.called, true);
    assert.deepEqual(stub.args, [
      [ '\u001b[31mError! \u001b[39mNo config file ' +
        '\'~/html5-school-presentation.json\' found!\nCreate a ' +
        'config file with this keys:\n{\n\t"songbook": ' +
        '{\n\t\t"path": "/Users/jf/Desktop/school/Lieder",' +
        '\n\t\t"json": "songs.json",\n\t\t"info": "info.json",' +
        '\n\t\t"slidesFolder": "slides",\n\t}\n}\n'
      ]
    ]);
  });

});

/**
 *
 */
describe('Exported functions', () => {

  it('"update()"', () => {
    rewireBootstrapped.update();
    var config = rewireBootstrapped.__get__('config');
    const auf = path.join('songs', 'a', 'Auf-der-Mauer_auf-der-Lauer');
    const swing = path.join('songs', 's', 'Swing-low');
    const zum = path.join('songs', 'z', 'Zum-Tanze-da-geht-ein-Maedel');
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

    var info = JSON.parse(fs.readFileSync(path.join(config.path, 'songs.json'), 'utf8'));
    assert.equal(
      info.a['Auf-der-Mauer_auf-der-Lauer'].title,
      'Auf der Mauer, auf der Lauer'
    );

    rewireBootstrapped.clean();
  });

  it('"setTestMode()"', () => {
    rewireBootstrapped.setTestMode();
    const config = rewireBootstrapped.__get__('config');
    assert.equal(config.test, true);
    assert.equal(config.path, path.resolve('./songs'));
  });

  it('"clean()"', () => {
    rewireBootstrapped.clean();
    assert.ok(!fs.existsSync(path.join('songs', 'songs.tex')));
  });

});
