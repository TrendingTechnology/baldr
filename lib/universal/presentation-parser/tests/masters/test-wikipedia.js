/* globals it */

const assert = require('assert')

const { wikipediaMModule } = require('../../dist/node/main.js')

describe('Master slide “wikipedia”', function () {
  it('Function “getFirstImage()”', async function () {
    const result = await wikipediaMModule.queryFirstImage(
      'Wolfgang_Amadeus_Mozart',
      'de'
    )
    assert.ok(result.includes('https://upload.wikimedia.org'))
    assert.ok(result.includes('.jpg'))
  })

  describe('Function “queryHtmlBody()”', function () {
    it('without oldid', async function () {
      this.timeout(10000)
      const result = await wikipediaMModule.queryHtmlBody(
        'Wolfgang_Amadeus_Mozart',
        'de'
      )
      assert.ok(result.includes('Mozart'))
    })

    it('oldid', async function () {
      const result = await wikipediaMModule.queryHtmlBody(
        'Wolfgang_Amadeus_Mozart',
        'de',
        15270
      )
      assert.ok(result.includes('"Zur Wohltätigkeit"'))
    })

    it('image', async function () {
      this.timeout(10000)
      const result = await wikipediaMModule.queryHtmlBody('Conrad_Martin', 'de')
      assert.ok(result.includes('src="https://upload.wikimedia.org'))
    })

    it('wiki links', async function () {
      this.timeout(10000)
      const result = await wikipediaMModule.queryHtmlBody('Conrad_Martin', 'de')
      assert.ok(result.includes('<a href="https://de.wikipedia.org/wiki'))
    })
  })

  describe('Function “getHtmlBody()”', function () {
    it('throws', async function () {
      this.timeout(10000)
      assert.throws(() => {
        wikipediaMModule.getHtmlBody('Mittelspannungsrichtlinie', 'de')
      })
      let result = await wikipediaMModule.queryHtmlBody(
        'Mittelspannungsrichtlinie',
        'de'
      )
      assert.ok(result.includes('Mittelspannungsrichtlinie'))
      result = wikipediaMModule.getHtmlBody(
        'Mittelspannungsrichtlinie',
        'de'
      )
      assert.ok(result.includes('Mittelspannungsrichtlinie'))
    })
  })
})
