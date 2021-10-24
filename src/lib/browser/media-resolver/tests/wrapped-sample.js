/* globals describe it */

const assert = require('assert')

const {
  WrappedSpecList,
  WrappedSampleList
} = require('../dist/node/wrapped-sample')
const { resolveSingleByUuid } = require('./_helper.js')
const { resetMediaCache } = require('../dist/node/cache.js')

function createSampleSpecs (input) {
  const list = new WrappedSpecList(input)
  return list.specs
}

function createSampleSpecsGetFirst (input) {
  const specs = createSampleSpecs(input)
  return specs[0]
}

describe('Package “@bldr/media-resolver”: File “wrapped-sample.ts”', function () {
  describe('Class “WrappedSpecList()”', function () {
    it('Single URI as a string', function () {
      const spec = createSampleSpecsGetFirst('ref:test')
      assert.strictEqual(spec.uri, 'ref:test#complete')
    })

    it('Single URI as an array', function () {
      const spec = createSampleSpecsGetFirst(['ref:test'])
      assert.strictEqual(spec.uri, 'ref:test#complete')
    })

    it('Single URI as a string with a custom title prefixed', function () {
      const spec = createSampleSpecsGetFirst('A title ref:test')
      assert.strictEqual(spec.uri, 'ref:test#complete')
      assert.strictEqual(spec.customTitle, 'A title')
    })

    it('Single URI as a string with a custom title suffixed', function () {
      const spec = createSampleSpecsGetFirst('ref:test A title')
      assert.strictEqual(spec.uri, 'ref:test#complete')
      assert.strictEqual(spec.customTitle, 'A title')
    })

    it('Single URI as a string with a custom title in the middle of the string', function () {
      const spec = createSampleSpecsGetFirst('prefix ref:test suffix')
      assert.strictEqual(spec.uri, 'ref:test#complete')
      assert.strictEqual(spec.customTitle, 'prefix suffix')
    })

    it('Single uuid URI as a string with a custom title in the middle of the string', function () {
      const spec = createSampleSpecsGetFirst(
        'prefix uuid:c64047d2-983d-4009-a35f-02c95534cb53 suffix'
      )
      assert.strictEqual(
        spec.uri,
        'uuid:c64047d2-983d-4009-a35f-02c95534cb53#complete'
      )
      assert.strictEqual(spec.customTitle, 'prefix suffix')
    })

    it('SimpleSampleSpec', function () {
      const spec = createSampleSpecsGetFirst({
        uri: 'ref:Final-Countdown_HB_The-Final-Countdown#blaeser-intro',
        title: 'Original'
      })
      assert.strictEqual(
        spec.uri,
        'ref:Final-Countdown_HB_The-Final-Countdown#blaeser-intro'
      )
      assert.strictEqual(spec.customTitle, 'Original')
    })

    it('string[]', function () {
      const specs = createSampleSpecs(['ref:test1', 'ref:test2'])
      assert.strictEqual(specs[0].uri, 'ref:test1#complete')
      assert.strictEqual(specs[1].uri, 'ref:test2#complete')
    })

    it('SimpleSampleSpec[]', function () {
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
      const specs = createSampleSpecs(input)
      assert.strictEqual(
        specs[0].uri,
        'ref:Final-Countdown_HB_The-Final-Countdown#blaeser-intro'
      )
      assert.strictEqual(specs[0].customTitle, 'Original')
      assert.strictEqual(
        specs[1].uri,
        'ref:Final-Countdown_HB_Mere-Rang-Mein-Rangne#blaeser-intro'
      )
      assert.strictEqual(specs[1].customTitle, 'Bollywood')
    })

    it('getter “uris”', function () {
      const list = new WrappedSpecList(['ref:test1#1', 'ref:test2#2'])
      const iterator = list.uris.values()
      assert.strictEqual(iterator.next().value, 'ref:test1#1')
      assert.strictEqual(iterator.next().value, 'ref:test2#2')
    })
  })

  it('class “WrappedSampleList()”', async function () {
    resetMediaCache()
    // ref: Dylan-Hard-Rain_HB_A-Hard-Rain-s-a-Gonna-Fall
    await resolveSingleByUuid('1eb60211-f3d5-45a1-a426-44926f14a32a')

    const list = new WrappedSampleList(
      'ref:Dylan-Hard-Rain_HB_A-Hard-Rain-s-a-Gonna-Fall'
    )
    const samplesCollection = list.getSamplesFromFirst()
    assert.ok(samplesCollection != null)
    const samples = samplesCollection.getAll()
    assert.strictEqual(
      samples[0].ref,
      'ref:Dylan-Hard-Rain_HB_A-Hard-Rain-s-a-Gonna-Fall#complete'
    )
    assert.strictEqual(
      samples[1].ref,
      'ref:Dylan-Hard-Rain_HB_A-Hard-Rain-s-a-Gonna-Fall#1_strophe'
    )
  })
})
