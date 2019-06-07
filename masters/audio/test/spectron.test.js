const {
  assert,
  Spectron
} = require('@bldr/test-helper')

describe('Master slide “audio”: “example.baldr” #spectron', function () {
  this.timeout(500000)

  beforeEach(function () {
    this.spectron = new Spectron('@bldr/electron-app', 'masters/audio/example.baldr')
    this.app = this.spectron.getApp()
    return this.spectron.start()
  })

  afterEach(function () {
    return this.spectron.stop()
  })

  it('Basic navigation', function () {
    return this.app.client
      .getText('li:nth-child(1) .artist')
      .then(artist => { assert.equal(artist, 'Joseph Haydn') })

      .getText('li:nth-child(1) .title')
      .then(artist => { assert.equal(artist, 'The Suprise') })

      .getText('li:nth-child(2)')
      .then(artist => { assert.equal(artist, 'Ludwig van Beethoven: Symphony No. 5') })

      .getText('li:nth-child(3)')
      .then(artist => { assert.equal(artist, 'Wolfgang Amadeus Mozart: Eine kleine Nachtmusik') })

      .keys(['Control', '1'])
      .getText('#media-info')
      .then(text => { assert.equal(text, 'Joseph Haydn: The Suprise') })
  })
})
