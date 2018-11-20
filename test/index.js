const {assert} = require('./lib/helper.js');
const path = require('path');
const fs = require('fs-extra');
const process = require('process');
const sinon = require('sinon');

const index = require('../index.js');
const json = require('../json.js');
const rewire = require('rewire')('../index.js');

let bootstrapConfig = rewire.__get__('bootstrapConfig');
bootstrapConfig({
  test: true,
  path: path.resolve('test', 'songs', 'clean', 'some'),
  force: true,
});

process.env.PATH = __dirname + '/bin:' + process.env.PATH;

describe('file “tex.js”', () => {
    let TeX = rewire.__get__('TeX');
    let basePath = path.resolve('test', 'songs', 'processed', 'some');
    let tex = new TeX(basePath);

  it('function “buildPianoFilesCountTree()”', () => {
    let folderTree = json.readJSON(basePath);
    let count = tex.buildPianoFilesCountTree(folderTree);
    assert.equal(count.a[3]['Auf-der-Mauer_auf-der-Lauer'].title, 'Auf der Mauer, auf der Lauer');
    assert.equal(count.s[1]['Stille-Nacht'].title, 'Stille Nacht');
    assert.equal(count.s[3]['Swing-low'].title, 'Swing low');
    assert.equal(count.z[2]['Zum-Tanze-da-geht-ein-Maedel'].title, 'Zum Tanze, da geht ein Mädel');

    assert.deepEqual(count.s[3]['Swing-low'].pianoFiles, [ 'piano_1.eps', 'piano_2.eps', 'piano_3.eps' ]);
  });

  it('function “texCmd()”', () => {
    assert.equal(tex.texCmd('lorem', 'ipsum'), '\\tmplorem{ipsum}\n');
  });

  it('function “texABC()”', () => {
    assert.equal(tex.texABC('a'), '\n\n\\tmpchapter{A}\n');
  });

  it('function “texSong()”', () => {
    let songPath = path.join(basePath, 's', 'Swing-low');
    assert.equal(
      tex.texSong(songPath),
      '\n' +
      '\\tmpheading{Swing low}\n' +
      '\\tmpimage{s/Swing-low/piano/piano_1.eps}\n' +
      '\\tmpimage{s/Swing-low/piano/piano_2.eps}\n' +
      '\\tmpimage{s/Swing-low/piano/piano_3.eps}\n'
    );
  });

  it('function “generateTeX()”', () => {
    texFile = path.join('test', 'songs', 'processed', 'some', 'songs.tex');
    tex.generateTeX(path.resolve('test', 'songs', 'processed', 'some'));
    assert.exists(texFile);

    var texContent = fs.readFileSync(texFile, 'utf8');
    var compare = fs.readFileSync(
      path.join('test', 'files', 'songs_processed.tex'), 'utf8'
    );

    assert.equal(texContent, compare);

    assert.ok(texContent.indexOf('\\tmpimage') > -1);
    assert.ok(texContent.indexOf('\\tmpheading') > -1);
  });

});

describe('file “index.js”', () => {

  describe('Configuration', () => {

    it('function “bootstrapConfig()”', () => {
      let bootstrapConfig = rewire.__get__('bootstrapConfig');
      bootstrapConfig({path: path.resolve('test', 'songs', 'clean', 'some'), test: true});
      const c = rewire.__get__('config');
      assert.equal(c.path, path.resolve('test', 'songs', 'clean', 'some'));
      assert.exists(path.resolve('test', 'songs', 'clean', 'some', 'filehashes.db'));
    });

    it('function “bootstrapConfig()”: exit', () => {
      let savePATH = process.env.PATH;
      process.env.PATH = '';
      try {
        let bootstrapConfig = rewire.__get__('bootstrapConfig');
        bootstrapConfig({path: path.resolve('test', 'songs', 'clean', 'some'), test: true});
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

  describe('Private functions', () => {
    it('function “processSongFolder()”', () => {
      processSongFolder = rewire.__get__("processSongFolder");
      let status = processSongFolder(
        path.join('test', 'songs', 'clean', 'some', 'a', 'Auf-der-Mauer_auf-der-Lauer')
      );

      assert.deepEqual(
        status,
        {
          "changed": {
            "piano": true,
            "slides": true
          },
          "folder": "test/songs/clean/some/a/Auf-der-Mauer_auf-der-Lauer",
          "folderName": "Auf-der-Mauer_auf-der-Lauer",
          "force": true,
          "generated": {
            "piano": [
              "piano_1.eps",
              "piano_2.eps"
            ],
            "projector": "projector.pdf",
            "slides": [
              "01.svg",
              "02.svg"
            ],
          },
          "info": {
            "title": "Auf der Mauer, auf der Lauer"
          }
        }
      );
    });
  });

  describe('Exported functions', () => {

    it('function “update()”', () => {
      let stub = sinon.stub();
      rewire.__set__('message.songFolder', stub);
      update = rewire.__get__('update');
      update();
      let songs = path.join('test', 'songs', 'clean', 'some');
      const auf = path.join(songs, 'a', 'Auf-der-Mauer_auf-der-Lauer');
      const swing = path.join(songs, 's', 'Swing-low');
      const zum = path.join(songs, 'z', 'Zum-Tanze-da-geht-ein-Maedel');
      const folders = [auf, swing, zum];

      for (i = 0; i < folders.length; ++i) {
        assert.exists(folders[i], 'slides');
        assert.exists(folders[i], 'slides', '01.svg');
        assert.exists(folders[i], 'piano');
        assert.exists(folders[i], 'piano', 'piano.mscx');
      }

      assert.exists(auf, 'piano', 'piano_1.eps');
      assert.exists(swing, 'piano', 'piano_1.eps');
      assert.exists(zum, 'piano', 'piano_1.eps');
      assert.exists(zum, 'piano', 'piano_2.eps');

      var info = JSON.parse(
        fs.readFileSync(
          path.join(songs, 'songs.json'), 'utf8'
        )
      );
      assert.equal(
        info.a['Auf-der-Mauer_auf-der-Lauer'].title,
        'Auf der Mauer, auf der Lauer'
      );

      let clean = rewire.__get__('clean');
      clean();
    });

    it('function “setTestMode()”', () => {
      let setTestMode = rewire.__get__('setTestMode');
      setTestMode();
      const config = rewire.__get__('config');
      assert.equal(config.test, true);
      assert.equal(config.path, path.resolve('test', 'songs', 'clean', 'some'));
    });

    it('function “clean()”', () => {
      let clean = rewire.__get__('clean');
      clean();
      assert.ok(!fs.existsSync(path.join('songs', 'songs.tex')));
    });

  });

});
