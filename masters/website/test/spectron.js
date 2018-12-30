const {
  assert,
  Spectron
} = require('@bldr/test-helper')

describe('Master slide “website”: “example.baldr” #website', function () {
  this.timeout(10000)

  beforeEach(function () {
    this.spectron = new Spectron('masters/website/example.baldr')
    this.app = this.spectron.getApp()
    return this.spectron.start()
  })

  afterEach(function () {
    return this.spectron.stop()
  })

  it('Text on the example slides', function () {
    return this.app.client
      .getAttribute('webview', 'src')
      .then(src => { assert.equal(src, 'https://de.wikipedia.org/wiki/Wikipedia:Hauptseite') })

      .click('#nav-slide-next')
      .getAttribute('webview', 'src')
      .then(src => { assert.equal(src, 'https://google.de/') })
  })
})
