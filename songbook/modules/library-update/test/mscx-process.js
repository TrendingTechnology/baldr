const {assert} = require('./lib/helper.js');
const path = require('path');
const fs = require('fs-extra');
const mscxProcess = require('../mscx-process.js');
const rewire = require('rewire')('../mscx-process.js');

describe('file “mscx-process.js”', () => {

  describe('function “checkExecutable()”', () => {
    it('function “checkExecutable()”: existing executable', () => {
      var checkExecutable = rewire.__get__('checkExecutable');
      assert.equal(checkExecutable('echo'), true);
    });

    it('function “checkExecutable()”: nonexisting executable', () => {
      var checkExecutable = rewire.__get__('checkExecutable');
      assert.equal(checkExecutable('loooooool'), false);
    });

    it('function “checkExecutables()”: all are existing', () => {
      let {status, unavailable} = mscxProcess
        .checkExecutables(['echo', 'ls']);
      assert.equal(status, true);
      assert.deepEqual(unavailable, []);
    });

    it('function “checkExecutables()”: one executable', () => {
      let {status, unavailable} =
        mscxProcess.checkExecutables(['echo']);
      assert.equal(status, true);
      assert.deepEqual(unavailable, []);
    });

    it('function “checkExecutables()”: one nonexisting executable', () => {
      let {status, unavailable} =
        mscxProcess.checkExecutables(['echo', 'loooooool']);
      assert.equal(status, false);
      assert.deepEqual(unavailable, ['loooooool']);
    });

    it('function “checkExecutables()”: two nonexisting executable', () => {
      let {status, unavailable} =
        mscxProcess.checkExecutables(['troooooool', 'loooooool']);
      assert.equal(status, false);
      assert.deepEqual(unavailable, ['troooooool', 'loooooool']);
    });

    it('function “checkExecutables()”: without arguments', () => {
      let {status, unavailable} = mscxProcess.checkExecutables();
      assert.equal(status, true);
      assert.deepEqual(unavailable, []);
    });
  });

  it('function “gitPull()”', () => {
    assert.ok(!mscxProcess.gitPull('songs'));
  });

  it('function “getMscoreCommand()”', () => {
    const getMscoreCommand = rewire.__get__('getMscoreCommand');
    if (process.platform == 'darwin') {
      assert.equal(getMscoreCommand(), '/Applications/MuseScore 2.app/Contents/MacOS/mscore');
    }
    else {
      assert.equal(getMscoreCommand(), 'mscore');
    }
  });

  it('function “generatePDF()”', () => {
    const folder = path.join('songs', 's', 'Swing-low');
    let file = mscxProcess.generatePDF(folder, 'projector', 'projector');
    assert.equal(file, 'projector.pdf');
    assert.exists(folder, 'projector.pdf');
  });

  it('function “generateSlides()”', () => {
    mscxProcess.generatePDF('s', 'Swing-low', 'projector');
    const folder = path.join('songs', 's', 'Swing-low');
    const slides = path.join(folder, 'slides');
    let files = mscxProcess.generateSlides(folder);

    assert.deepEqual(
      files,
      ['01.svg', '02.svg']
    );

    [
      [slides, '01.svg'],
      [slides, '02.svg']
    ].forEach(args => {assert.exists(...args);});

    fs.removeSync(slides);
  });

  describe('function “generatePianoEPS()”', () => {

    it('function “generatePianoEPS()”: lead', () => {
      const folder = path.join('songs', 's', 'Swing-low');
      let files = mscxProcess.generatePianoEPS(folder);

      assert.deepEqual(
        files,
        ['piano_1.eps', 'piano_2.eps']
      );

      [
        [folder, 'piano'],
        [folder, 'piano', 'piano.mscx'],
        [folder, 'piano', 'piano_1.eps']
      ].forEach(args => {assert.exists(...args);});

      fs.removeSync(path.join(folder, 'piano'));
    });

    it('function “generatePianoEPS()”: piano', () => {
      const folder = path.join('songs', 'a', 'Auf-der-Mauer_auf-der-Lauer');
      mscxProcess.generatePianoEPS(folder);

      [
        [folder, 'piano'],
        [folder, 'piano', 'piano.mscx'],
        [folder, 'piano', 'piano_1.eps']
      ].forEach(args => {assert.exists(...args);});

      fs.removeSync(path.join(folder, 'piano'));
    });

  });

});
