const {assert} = require('./lib/helper.js');
const sinon = require('sinon');
const message = require('../message.js');
const rewire = require('rewire')('../message.js');

describe('file “message.js”', () => {

  it('function “info()”', () => {
    stub = sinon.stub();
    rewire.__set__('info', stub);
    let info = rewire.__get__('info');
    info('lol');
    assert.equal(info.called, true);
  });

  it('const “error”', () => {
    let error = rewire.__get__('error');
    assert.equal(error, '\u001b[31m☒\u001b[39m');
  });

  it('const “finished”', () => {
    let arrow = rewire.__get__('finished');
    assert.equal(arrow, '\u001b[32m☑\u001b[39m');
  });

  it('const “progress”', () => {
    let arrow = rewire.__get__('progress');
    assert.equal(arrow, '\u001b[33m☐\u001b[39m');
  });

  it('function “noConfigPath()”', () => {
    stub = sinon.stub();

    let revert = rewire.__set__('info', stub);
    noConfigPath = rewire.__get__('noConfigPath');

    try {
      noConfigPath();
    }
    catch (e) {
      assert.equal(e.message, 'No configuration file found.');
    }
    assert.equal(stub.called, true);
    assert.deepEqual(stub.args, [
      [ '\u001b[31m☒\u001b[39m  Configuration file “~/.html5-school-presentation.json” not found!\nCreate such a config file or use the “--path” option!\n\nExample configuration file:\n{\n\t\"songbook\": {\n\t\t\"path\": \"/home/jf/songs\"\n\t}\n}\n' ]
    ]);
  });

  it('function “songFolder()”', () => {
    let status = {
      "changed": {
        "lead": false,
        "piano": false,
        "projector": false
      },
      "folder": "songs/a/Auf-der-Mauer_auf-der-Lauer",
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
    };

    let finished = status;
    message.songFolder(finished);

    let progress = status;
    progress.changed.projector = true;
    message.songFolder(progress);

    let noTitle = status;
    noTitle.info.title = undefined;
    message.songFolder(noTitle);
  });

});
