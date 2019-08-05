const {
  assert,
  Spectron
} = require('@bldr/test-helper')

describe('Master slide “website”: “example.baldr” #website', function () {
  this.timeout(50000)

  beforeEach(function () {
    this.spectron = new Spectron('@bldr/electron-app', 'masters/website/example.baldr')
    this.app = this.spectron.getApp()
    return this.spectron.start()
  })

  afterEach(function () {
    return this.spectron.stop()
  })

  it.skip('Text on the example slides', function () {
    return this.app.client
      .getAttribute('webview', 'src')
      .then(src => { assert.equal(src, 'https://www.google.de/') })

      .click('#nav-slide-next')
      .getAttribute('webview', 'src')
      .then(src => { assert.equal(src, 'https://www.google.com/') })
  })
})
