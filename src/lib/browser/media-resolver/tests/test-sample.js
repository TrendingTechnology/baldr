/* globals describe it */

const assert = require('assert')

const { createAsset } = require('./_helper')
const { resetMediaCache } = require('../dist/node/cache.js')

describe('Package “@bldr/media-resolver”: File “sample.ts”', function () {
  describe('Class “Sample”', function () {
    it('Default sample “complete”', function () {
      const asset = createAsset({ mimeType: 'audio', path: 'dir/test.mp3' })
      const sample = asset.samples.get('ref:test#complete')
      assert.strictEqual(sample.ref, 'ref:test#complete')
      assert.strictEqual(sample.title, 'komplett')
    })

    it('Samples form the “samples” property', function () {
      const asset = createAsset({
        mimeType: 'audio',
        path: 'dir/test.mp3',
        samples: [
          { ref: 'sample1' },
          { ref: 'sample2' },
          { ref: 'sample3' }
        ]
      })
      assert.strictEqual(asset.samples.size, 4)
      const samples = asset.samples.getAll()
      assert.strictEqual(samples[0].ref, 'ref:test#complete')
      assert.strictEqual(samples[1].ref, 'ref:test#sample1')
      assert.strictEqual(samples[1].title, 'sample1')
      assert.strictEqual(samples[2].ref, 'ref:test#sample2')
      assert.strictEqual(samples[3].ref, 'ref:test#sample3')
    })

    it('Samples without ref and title', function () {
      const asset = createAsset({
        mimeType: 'audio',
        path: 'dir/test.mp3',
        samples: [
          { startTime: 1 },
          { startTime: 2 },
          { startTime: 3 }
        ]
      })
      const samples = asset.samples.getAll()
      assert.strictEqual(samples[0].ref, 'ref:test#complete')
      assert.strictEqual(samples[1].ref, 'ref:test#sample1')
      assert.strictEqual(samples[1].title, 'Ausschnitt 1')
      assert.strictEqual(samples[2].title, 'Ausschnitt 2')
      assert.strictEqual(samples[3].title, 'Ausschnitt 3')
    })

    it('Error: two complete samples', function () {
      assert.throws(() => {
        createAsset({
          mimeType: 'audio',
          path: 'dir/test.mp3',
          startTime: 1,
          samples: [
            { ref: 'complete', startTime: 1 }
          ]
        })
      })
    })
  })

  describe('Class “SampleCollection”', function () {
    it('getter “complete”', function () {
      resetMediaCache()
      const asset = createAsset({ mimeType: 'audio', path: 'dir/test.mp3' })
      const sample = asset.samples.complete
      assert.strictEqual(sample.ref, 'ref:test#complete')
      assert.strictEqual(sample.title, 'komplett')
      assert.strictEqual(sample.shortcut, 'a 1')
    })
  })
})
