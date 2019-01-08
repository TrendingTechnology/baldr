const path = require('path')
const {
  assert,
  Spectron
} = require('@bldr/test-helper')

describe('Package “@bldr/songbook-electron-app”', function () {
  this.timeout(40000)

  beforeEach(function () {
    this.timeout(40000)
    process.env.BALDR_SONGBOOK_PATH = path.resolve(__dirname, 'songs', 'real')
    this.spectron = new Spectron('@bldr/songbook-electron-app')
    this.app = this.spectron.getApp()
    return this.spectron.start()
  })

  afterEach(function () {
    return this.spectron.stop()
  })

  describe('application launch', function () {
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
})
