/* jshint esversion: 6 */

const {assert} = require('./lib/helper.js');
const path = require('path');
const fs = require('fs-extra');
const mscxProcess = require('../mscx-process.js');
const rewire = require('rewire')('../mscx-process.js');

describe('mscx-process', () => {

  describe('"check executables"', () => {
    it('"checkExecutable()": existing executable', () => {
      var checkExecutable = rewire.__get__('checkExecutable');
      assert.equal(checkExecutable('echo'), true);
    });

    it('"checkExecutable()": nonexisting executable', () => {
      var checkExecutable = rewire.__get__('checkExecutable');
      assert.equal(checkExecutable('loooooool'), false);
    });

    it('"checkExecutables()"', () => {
      assert.equal(
        mscxProcess.checkExecutables(['echo', 'ls']), true
      );
    });
  });

  it('"getMscoreCommand()"', () => {
    const getMscoreCommand = rewire.__get__('getMscoreCommand');
    if (process.platform == 'darwin') {
      assert.equal(getMscoreCommand(), '/Applications/MuseScore 2.app/Contents/MacOS/mscore');
    }
    else {
      assert.equal(getMscoreCommand(), 'mscore');
    }
  });

  it('"generatePDF()"', () => {
    const folder = path.join('songs', 's', 'Swing-low');
    mscxProcess.generatePDF(folder, 'projector', 'projector');
    assert.exists(folder, 'projector.pdf');
  });

  it('"generateSlides()"', () => {
    mscxProcess.generatePDF('s', 'Swing-low', 'projector');
    const folder = path.join('songs', 's', 'Swing-low');
    const slides = path.join(folder, 'slides');
    mscxProcess.generateSlides(folder);
    assert.exists(slides, '01.svg');
    assert.exists(slides, '02.svg');
    fs.removeSync(slides);
  });

  describe('"generatePianoEPS()"', () => {
    it('"generatePianoEPS()": lead', () => {
      const folder = path.join('songs', 's', 'Swing-low');
      mscxProcess.generatePianoEPS(folder);
      assert.exists(folder, 'piano');
      assert.exists(folder, 'piano', 'piano.mscx');
      assert.exists(folder, 'piano', 'piano_1.eps');
      fs.removeSync(path.join(folder, 'piano'));
    });

    it('"generatePianoEPS()": piano', () => {
      const folder = path.join('songs', 'a', 'Auf-der-Mauer_auf-der-Lauer');
      mscxProcess.generatePianoEPS(folder);
      assert.exists(folder, 'piano');
      assert.exists(folder, 'piano', 'piano.mscx');
      assert.exists(folder, 'piano', 'piano_1.eps');
      fs.removeSync(path.join(folder, 'piano'));
    });

  });


});
