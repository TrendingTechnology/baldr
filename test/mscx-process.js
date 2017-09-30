/* jshint esversion: 6 */

const {assert} = require('./lib/helper.js');
const path = require('path');
const fs = require('fs-extra');
const jsonProcess = require('../mscx-process.js');
const rewire = require('rewire')('../mscx-process.js');

describe('mscx-process', () => {

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

  it('"getMscoreCommand()"', () => {
    const getMscoreCommand = slu.__get__('getMscoreCommand');
    if (process.platform == 'darwin') {
      assert.equal(getMscoreCommand(), '/Applications/MuseScore 2.app/Contents/MacOS/mscore');
    }
    else {
      assert.equal(getMscoreCommand(), 'mscore');
    }
  });

  it('"generatePDF()"', () => {
    const generatePDF = slu.__get__('generatePDF');
    const folder = p('songs', 's', 'Swing-low');
    generatePDF(folder, 'projector', 'projector');
    assert.exists(folder, 'projector.pdf');
  });


  it('"generateSlides()"', () => {
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
    it('"generatePianoEPS()": lead', () => {
      var generatePianoEPS = slu.__get__('generatePianoEPS');
      var config = slu.__get__('config');
      const folder = p('songs', 's', 'Swing-low');
      generatePianoEPS(folder);
      assert.exists(folder, 'piano');
      assert.exists(folder, 'piano', 'piano.mscx');
      assert.exists(folder, 'piano', 'piano_1.eps');
      fs.removeSync(p(folder, 'piano'));
    });

    it('"generatePianoEPS()": piano', () => {
      var generatePianoEPS = slu.__get__('generatePianoEPS');
      var config = slu.__get__('config');
      const folder = p('songs', 'a', 'Auf-der-Mauer_auf-der-Lauer');
      generatePianoEPS(folder);
      assert.exists(folder, 'piano');
      assert.exists(folder, 'piano', 'piano.mscx');
      assert.exists(folder, 'piano', 'piano_1.eps');
      fs.removeSync(p(folder, 'piano'));
    });

  });


});
