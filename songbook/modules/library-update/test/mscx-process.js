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
      var check = checkExecutable('echo');
      assert.equal(check, true);
    });

    it('"checkExecutable()": nonexisting executable', () => {
      var checkExecutable = rewire.__get__('checkExecutable');
      var check = checkExecutable('loooooool');
      assert.equal(typeof(check), 'string');
    });

    it('"checkExecutable()": nonexisting executable', () => {
      var checkExecutable = rewire.__get__('checkExecutable');
      var check = checkExecutable('loooooool');
      assert.equal(typeof(check), 'string');
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
    const generatePDF = rewire.__get__('generatePDF');
    const folder = path.join('songs', 's', 'Swing-low');
    generatePDF(folder, 'projector', 'projector');
    assert.exists(folder, 'projector.pdf');
  });

  it('"generateSlides()"', () => {
    var generatePDF = rewire.__get__('generatePDF');
    var generateSlides = rewire.__get__('generateSlides');
    generatePDF('s', 'Swing-low', 'projector');
    const folder = path.join('songs', 's', 'Swing-low');
    const slides = path.join(folder, 'slides');
    generateSlides(folder);
    assert.exists(slides, '01.svg');
    assert.exists(slides, '02.svg');
    fs.removeSync(slides);
  });

  describe('"generatePianoEPS()"', () => {
    it('"generatePianoEPS()": lead', () => {
      var generatePianoEPS = rewire.__get__('generatePianoEPS');
      const folder = path.join('songs', 's', 'Swing-low');
      generatePianoEPS(folder);
      assert.exists(folder, 'piano');
      assert.exists(folder, 'piano', 'piano.mscx');
      assert.exists(folder, 'piano', 'piano_1.eps');
      fs.removeSync(path.join(folder, 'piano'));
    });

    it('"generatePianoEPS()": piano', () => {
      var generatePianoEPS = rewire.__get__('generatePianoEPS');
      const folder = path.join('songs', 'a', 'Auf-der-Mauer_auf-der-Lauer');
      generatePianoEPS(folder);
      assert.exists(folder, 'piano');
      assert.exists(folder, 'piano', 'piano.mscx');
      assert.exists(folder, 'piano', 'piano_1.eps');
      fs.removeSync(path.join(folder, 'piano'));
    });

  });


});
