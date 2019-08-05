const {
  assert,
  Spectron
} = require('@bldr/test-helper')

describe('Master slide “camera”: “example.baldr” #spectron', function () {
  this.timeout(50000)

  beforeEach(function () {
    this.spectron = new Spectron('@bldr/electron-app', 'masters/camera/example.baldr')
    this.app = this.spectron.getApp()
    return this.spectron.start()
  })

  afterEach(function () {
    return this.spectron.stop()
  })

  it('Basic navigation', function () {
    return this.app.client
      .click('#modal-open')
      .getText('#modal-content label')
      .then(text => { assert.equal(text, 'Video source:') })

      .click('#modal-open')
      .click('#nav-slide-next')

      .keys(['Control', 'Alt', 'c'])
      .click('#modal-open')
      .getText('#modal-content label')
      .then(text => { assert.equal(text, 'Video source:') })
  })
})
