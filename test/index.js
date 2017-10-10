const {assert} = require('./lib/helper.js');
const path = require('path');
const fs = require('fs-extra');
const process = require('process');
const sinon = require('sinon');

const index = require('../index.js');

var rewireBootstrapped = require('rewire')('../index.js');
rewireBootstrapped.bootstrapConfig({
  test: true,
  path: path.resolve('test', 'songs', 'clean', 'some'),
  force: true,
});

const rewire = require('rewire')('../index.js');

process.env.PATH = __dirname + '/bin:' + process.env.PATH;

describe('file “index.js”', () => {

  describe('Configuration', () => {

    it('function “bootstrapConfig()”', () => {
      rewire.bootstrapConfig({path: path.resolve('test', 'songs', 'clean', 'some'), test: true});
      const c = rewire.__get__('config');
      assert.equal(c.path, path.resolve('test', 'songs', 'clean', 'some'));
      assert.exists(path.resolve('test', 'songs', 'clean', 'some', 'filehashes.db'));
    });

    it('function “bootstrapConfig()”: exit', () => {
      let savePATH = process.env.PATH;
      process.env.PATH = '';
      try {
        rewire.bootstrapConfig({path: path.resolve('test', 'songs', 'clean', 'some'), test: true});
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
      processSongFolder = rewireBootstrapped.__get__("processSongFolder");
      let status = processSongFolder(
        path.join('test', 'songs', 'clean', 'some', 'a', 'Auf-der-Mauer_auf-der-Lauer')
      );

      assert.deepEqual(
        status,
        {
          "changed": {
            "piano": false,
            "slides": false
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
      rewireBootstrapped.__set__('message.songFolder', stub);
      rewireBootstrapped.update();
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

      rewireBootstrapped.clean();
    });

    it('function “setTestMode()”', () => {
      rewireBootstrapped.setTestMode();
      const config = rewireBootstrapped.__get__('config');
      assert.equal(config.test, true);
      assert.equal(config.path, path.resolve('test', 'songs', 'clean', 'some'));
    });

    it('function “clean()”', () => {
      rewireBootstrapped.clean();
      assert.ok(!fs.existsSync(path.join('songs', 'songs.tex')));
    });

  });

});
