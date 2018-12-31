let assert = require('assert')
const fs = require('fs')
const path = require('path')
let Application = require('spectron').Application

let pkg = require(path.join('packages', 'electron-app', 'package.json'))

let darwinPath = []

if (process.platform === 'darwin') {
  darwinPath = ['baldr-songbook.app', 'Contents', 'MacOS']
}

let appPath = path.join(
  'packages', 'electron-app', 'dist',
  `${pkg.name}-${process.platform}-${process.arch}`,
  ...darwinPath,
  pkg.name
)

describe('build', () => {
  it(`exists “${appPath}”`, () => {
    assert.ok(fs.existsSync(appPath))
  })
})

describe('application launch', function () {
  this.timeout(10000)

  beforeEach(function () {
    process.env.BALDR_SONGBOOK_PATH = path.resolve(__dirname, 'songs', 'real')
    this.app = new Application({
      path: appPath
    })
    return this.app.start()
  })

  afterEach(function () {
    if (this.app && this.app.isRunning()) {
      return this.app.stop()
    }
  })

  it('Initial window', function () {
    return this.app.client
      .getWindowCount()
      .then(count => {
        assert.strictEqual(count, 1)
      })
      .getTitle()
      .then(text => {
        assert.strictEqual(text, 'Liederbuch „Die besten Lieder“')
      })
  })

  it('tableofcontent', function () {
    return this.app.client
      .click('#search .close')
      .keys('Alt')
      .getText('#tableofcontents h2').then(function (text) {
        assert.strictEqual(text, 'Inhaltsverzeichnis')
      })
      .getText('#song_Swing-low').then(function (text) {
        assert.strictEqual(text, 'Swing low')
      })
      .getText('table-of-contents ul li ul li').then(function (text) {
        assert.deepStrictEqual(
          text,
          [
            'Auf der Mauer, auf der Lauer',
            'Stille Nacht',
            'Swing low',
            'Zum Tanze, da geht ein Mädel'
          ]
        )
      })
      // .click('#song_Swing-low')
      // .getHTML('img').then(html => {
      //   assert.strictEqual(html, '<img>')
      // })
  })

  it('selectize', function () {
    return this.app.client.element('.selectize-control')
      .then(field => {
        assert.ok(field.value.ELEMENT)
      })
      .$$('.selectize-dropdown-content .option')
      .then(options => {
        assert.strictEqual(options.length, 4)
      })
  })

  it('is Fullscreen', function () {
    return this.app.browserWindow
      .isFullScreen()
      .then(full => {
        assert.strictEqual(full, true)
      })
  })

  it('set Fullscreen', function () {
    this.app.browserWindow.setFullScreen(false)
    return this.app.browserWindow
      .isFullScreen()
      .then(full => {
        assert.strictEqual(full, false)
      })
  })
})
