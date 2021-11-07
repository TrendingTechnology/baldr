/* globals describe it */

const assert = require('assert')

const { WrappedUriList } = require('../dist/node/fuzzy-uri.js')

function createWrappedUriList (input) {
  const list = new WrappedUriList(input)
  return list.specs
}

function getFirstWrappedUri (input) {
  const specs = createWrappedUriList(input)
  return specs[0]
}

describe('File “fuzzy-uri.ts”', function () {
  describe('Class “WrappedUriList()”', function () {
    it('Single URI as a string', function () {
      const spec = getFirstWrappedUri('ref:test')
      assert.strictEqual(spec.uri, 'ref:test')
    })

    it('Single URI as an array', function () {
      const spec = getFirstWrappedUri(['ref:test'])
      assert.strictEqual(spec.uri, 'ref:test')
    })

    it('Single URI as a string with a custom title prefixed', function () {
      const spec = getFirstWrappedUri('A title ref:test')
      assert.strictEqual(spec.uri, 'ref:test')
      assert.strictEqual(spec.title, 'A title')
    })

    it('Single URI as a string with a custom title suffixed', function () {
      const spec = getFirstWrappedUri('ref:test A title')
      assert.strictEqual(spec.uri, 'ref:test')
      assert.strictEqual(spec.title, 'A title')
    })

    it('Single URI as a string with a custom title in the middle of the string', function () {
      const spec = getFirstWrappedUri('prefix ref:test   suffix')
      assert.strictEqual(spec.uri, 'ref:test')
      assert.strictEqual(spec.title, 'prefix suffix')
    })

    it('Single uuid URI as a string with a custom title in the middle of the string', function () {
      const spec = getFirstWrappedUri(
        'prefix uuid:c64047d2-983d-4009-a35f-02c95534cb53 suffix'
      )
      assert.strictEqual(spec.uri, 'uuid:c64047d2-983d-4009-a35f-02c95534cb53')
      assert.strictEqual(spec.title, 'prefix suffix')
    })

    it('No title with “.”', function () {
      const spec = getFirstWrappedUri(
        'ref:test .'
      )
      assert.strictEqual(spec.uri, 'ref:test')
      assert.strictEqual(spec.title, undefined)
    })

    it('No title with “none”', function () {
      const spec = getFirstWrappedUri(
        'ref:test none'
      )
      assert.strictEqual(spec.uri, 'ref:test')
      assert.strictEqual(spec.title, undefined)
    })

    it('WrappedUri', function () {
      const spec = getFirstWrappedUri({
        uri: 'ref:Final-Countdown_HB_The-Final-Countdown#blaeser-intro',
        title: 'Original'
      })
      assert.strictEqual(
        spec.uri,
        'ref:Final-Countdown_HB_The-Final-Countdown#blaeser-intro'
      )
      assert.strictEqual(spec.title, 'Original')
    })

    it('string[]', function () {
      const specs = createWrappedUriList(['ref:test1', 'ref:test2'])
      assert.strictEqual(specs[0].uri, 'ref:test1')
      assert.strictEqual(specs[1].uri, 'ref:test2')
    })

    it('WrappedUri[]', function () {
      const input = [
        {
          uri: 'ref:Final-Countdown_HB_The-Final-Countdown#blaeser-intro',
          title: 'Original'
        },
        {
          uri: 'ref:Final-Countdown_HB_Mere-Rang-Mein-Rangne#blaeser-intro',
          title: 'Bollywood'
        }
      ]
      const specs = createWrappedUriList(input)
      assert.strictEqual(
        specs[0].uri,
        'ref:Final-Countdown_HB_The-Final-Countdown#blaeser-intro'
      )
      assert.strictEqual(specs[0].title, 'Original')
      assert.strictEqual(
        specs[1].uri,
        'ref:Final-Countdown_HB_Mere-Rang-Mein-Rangne#blaeser-intro'
      )
      assert.strictEqual(specs[1].title, 'Bollywood')
    })

    it('getter “uris”', function () {
      const list = new WrappedUriList(['ref:test1#1', 'ref:test2#2'])
      const iterator = list.uris.values()
      assert.strictEqual(iterator.next().value, 'ref:test1')
      assert.strictEqual(iterator.next().value, 'ref:test2')
    })
  })
})
