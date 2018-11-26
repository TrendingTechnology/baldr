const { assert } = require('./lib/helper.js')
const path = require('path')
const fs = require('fs-extra')
const mscx = require('../mscx.js')
const rewire = require('rewire')('../mscx.js')

describe('file “mscx.js”', () => {
  describe('function “checkExecutable()”', () => {
    it('function “checkExecutable()”: existing executable', () => {
      let checkExecutable = rewire.__get__('checkExecutable')
      assert.strictEqual(checkExecutable('echo'), true)
    })

    it('function “checkExecutable()”: nonexisting executable', () => {
      let checkExecutable = rewire.__get__('checkExecutable')
      assert.strictEqual(checkExecutable('loooooool'), false)
    })

    it('function “checkExecutables()”: all are existing', () => {
      let { status, unavailable } = mscx
        .checkExecutables(['echo', 'ls'])
      assert.strictEqual(status, true)
      assert.deepStrictEqual(unavailable, [])
    })

    it('function “checkExecutables()”: one executable', () => {
      let { status, unavailable } =
        mscx.checkExecutables(['echo'])
      assert.strictEqual(status, true)
      assert.deepStrictEqual(unavailable, [])
    })

    it('function “checkExecutables()”: one nonexisting executable', () => {
      let { status, unavailable } =
        mscx.checkExecutables(['echo', 'loooooool'])
      assert.strictEqual(status, false)
      assert.deepStrictEqual(unavailable, ['loooooool'])
    })

    it('function “checkExecutables()”: two nonexisting executable', () => {
      let { status, unavailable } =
        mscx.checkExecutables(['troooooool', 'loooooool'])
      assert.strictEqual(status, false)
      assert.deepStrictEqual(unavailable, ['troooooool', 'loooooool'])
    })

    it('function “checkExecutables()”: without arguments', () => {
      let { status, unavailable } = mscx.checkExecutables()
      assert.strictEqual(status, true)
      assert.deepStrictEqual(unavailable, [])
    })
  })

  it('function “gitPull()”', () => {
    assert.ok(!mscx.gitPull('songs'))
  })

  it('function “generatePDF()”', () => {
    const folder = path.join('test', 'songs', 'clean', 'some', 's', 'Swing-low')
    let file = mscx.generatePDF(folder, 'projector', 'projector')
    assert.strictEqual(file, 'projector.pdf')
    assert.exists(folder, 'projector.pdf')
  })

  it('function “generateSlides()”', () => {
    mscx.generatePDF('s', 'Swing-low', 'projector')
    const folder = path.join('test', 'songs', 'clean', 'some', 's', 'Swing-low')
    const slides = path.join(folder, 'slides')
    let files = mscx.generateSlides(folder)

    assert.deepStrictEqual(
      files,
      ['01.svg', '02.svg']
    );

    [
      [slides, '01.svg'],
      [slides, '02.svg']
    ].forEach(args => { assert.exists(...args) })

    fs.removeSync(slides)
  })

  describe('function “generatePianoEPS()”', () => {
    it('function “generatePianoEPS()”: lead', () => {
      const folder = path.join('test', 'songs', 'clean', 'some', 's', 'Swing-low')
      let files = mscx.generatePianoEPS(folder)

      assert.deepStrictEqual(
        files,
        ['piano_1.eps', 'piano_2.eps']
      );

      [
        [folder, 'piano'],
        [folder, 'piano', 'piano.mscx'],
        [folder, 'piano', 'piano_1.eps']
      ].forEach(args => { assert.exists(...args) })

      fs.removeSync(path.join(folder, 'piano'))
    })

    it('function “generatePianoEPS()”: piano', () => {
      const folder = path.join('test', 'songs', 'clean', 'some', 'a', 'Auf-der-Mauer_auf-der-Lauer')
      mscx.generatePianoEPS(folder);

      [
        [folder, 'piano'],
        [folder, 'piano', 'piano.mscx'],
        [folder, 'piano', 'piano_1.eps']
      ].forEach(args => { assert.exists(...args) })

      fs.removeSync(path.join(folder, 'piano'))
    })
  })
})
