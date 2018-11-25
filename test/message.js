const { assert } = require('./lib/helper.js')
const sinon = require('sinon')
const rewire = require('rewire')('../message.js')

const status = {
  'changed': {
    'piano': false,
    'slides': false
  },
  'folder': 'songs/a/Auf-der-Mauer_auf-der-Lauer',
  'folderName': 'Auf-der-Mauer_auf-der-Lauer',
  'force': false,
  'generated': {},
  'info': {
    'title': 'Auf der Mauer, auf der Lauer'
  }
}

let clone = function (object) {
  return JSON.parse(JSON.stringify(object))
}

assert.songFolder = function (status, output) {
  let stub = sinon.stub()

  let revert = rewire.__set__('info', stub)
  let songFolder = rewire.__get__('songFolder')

  songFolder(status)
  // console.log(stub.args[0]);
  assert.equal(stub.args[0], output)
  revert()
}

describe('file “message.js”', () => {
  it('function “info()”', () => {
    let stub = sinon.stub()
    rewire.__set__('info', stub)
    let info = rewire.__get__('info')
    info('lol')
    assert.equal(info.called, true)
  })

  it('const “error”', () => {
    let error = rewire.__get__('error')
    assert.equal(error, '\u001b[31m☒\u001b[39m')
  })

  it('const “finished”', () => {
    let arrow = rewire.__get__('finished')
    assert.equal(arrow, '\u001b[32m☑\u001b[39m')
  })

  it('const “progress”', () => {
    let arrow = rewire.__get__('progress')
    assert.equal(arrow, '\u001b[33m☐\u001b[39m')
  })

  it('function “noConfigPath()”', () => {
    let stub = sinon.stub()

    let revert = rewire.__set__('info', stub)
    let noConfigPath = rewire.__get__('noConfigPath')

    try {
      noConfigPath()
    } catch (e) {
      assert.equal(e.message, 'No configuration file found.')
    }
    assert.equal(stub.called, true)
    assert.deepEqual(stub.args, [
      [ '\u001b[31m☒\u001b[39m  Configuration file “~/.baldr.json” not found!\nCreate such a config file or use the “--path” option!\n\nExample configuration file:\n{\n\t"songbook": {\n\t\t"path": "/home/jf/songs"\n\t}\n}\n' ]
    ])
    revert()
  })

  describe('function “songFolder()”', () => {
    it('finished', () => {
      let finished = clone(status)
      assert.songFolder(
        finished,
        '\u001b[32m☑\u001b[39m  \u001b[32mAuf-der-Mauer_auf-der-Lauer\u001b[39m: Auf der Mauer, auf der Lauer'
      )
    })

    it('progress', () => {
      let progress = clone(status)
      progress.changed.slides = true
      assert.songFolder(
        progress,
        '\u001b[33m☐\u001b[39m  \u001b[33mAuf-der-Mauer_auf-der-Lauer\u001b[39m: Auf der Mauer, auf der Lauer'
      )
    })

    it('noTitle', () => {
      let noTitle = clone(status)
      noTitle.info.title = undefined
      assert.songFolder(
        noTitle,
        '\u001b[31m☒\u001b[39m  \u001b[31mAuf-der-Mauer_auf-der-Lauer\u001b[39m'
      )
    })

    it('forced', () => {
      let forced = clone(status)
      forced.generated =
        {
          'piano': [
            'piano_1.eps',
            'piano_2.eps'
          ],
          'projector': 'projector.pdf',
          'slides': [
            '01.svg',
            '02.svg'
          ]
        }
      forced.force = true
      assert.songFolder(
        forced,
        '\u001b[32m☑\u001b[39m  \u001b[32mAuf-der-Mauer_auf-der-Lauer\u001b[39m: Auf der Mauer, auf der Lauer \u001b[31m(forced)\u001b[39m\n\t\u001b[33mslides\u001b[39m: 01.svg, 02.svg\n\t\u001b[33mpiano\u001b[39m: piano_1.eps, piano_2.eps'
      )
    })

    it('generatedPiano', () => {
      let generatedPiano = clone(status)
      generatedPiano.changed.piano = true
      generatedPiano.generated =
        {
          'piano': [
            'piano_1.eps',
            'piano_2.eps'
          ]
        }
      assert.songFolder(
        generatedPiano,
        '\u001b[33m☐\u001b[39m  \u001b[33mAuf-der-Mauer_auf-der-Lauer\u001b[39m: Auf der Mauer, auf der Lauer\n\t\u001b[33mpiano\u001b[39m: piano_1.eps, piano_2.eps'
      )
    })

    it('generatedSlides', () => {
      let generatedSlides = clone(status)
      generatedSlides.changed.slides = true
      generatedSlides.generated =
        {
          'projector': 'projector.pdf',
          'slides': [
            '01.svg',
            '02.svg'
          ]
        }
      assert.songFolder(
        generatedSlides,
        '\u001b[33m☐\u001b[39m  \u001b[33mAuf-der-Mauer_auf-der-Lauer\u001b[39m: Auf der Mauer, auf der Lauer\n\t\u001b[33mslides\u001b[39m: 01.svg, 02.svg'
      )
    })
  })
})
