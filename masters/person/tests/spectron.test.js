const {
  assert,
  Spectron
} = require('@bldr/test-helper')

describe('Master slide “person”: “example.baldr” #spectron', function () {
  this.timeout(50000)

  beforeEach(function () {
    this.spectron = new Spectron('@bldr/electron-app', 'masters/person/example.baldr')
    this.app = this.spectron.getApp()
    return this.spectron.start()
  })

  afterEach(function () {
    return this.spectron.stop()
  })

  it('Text on the example slides', function () {
    return this.app.client
      .getText('.info-box .person')
      .then(text => { assert.equal(text, 'Ludwig van Beethoven') })
  })
})
