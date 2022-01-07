/* globals describe it beforeEach */

const assert = require('assert')

const { Resolver } = require('../dist/node/main.js')
const resolver = new Resolver()

describe('File “sample.ts”', function () {
  describe('Class “Sample”', function () {
    let sample
    beforeEach(async function () {
      // ref:Hip-Hop-Hoerquiz_HB_Herbie-Hancock_Cantaloupe-Island
      sample = await resolver.resolveSample(
        'uuid:edd86315-64c1-445c-bcd3-b0dab14af112'
      )
    })

    it('Property “shortcut”', async function () {
      assert.strictEqual(sample.shortcut, 'a 1')
    })

    it('Property “durationSec”', async function () {
      assert.strictEqual(sample.durationSec, undefined)
    })

    it('Property “startTimeSec”', async function () {
      assert.strictEqual(sample.startTimeSec, 0)
    })

    it('Property “fadeInSec”', async function () {
      assert.strictEqual(sample.fadeInSec, 0.3)
    })

    it('Property “fadeOutSec”', async function () {
      assert.strictEqual(sample.fadeOutSec, 1)
    })

    it('Accessor “ref”', async function () {
      assert.strictEqual(
        sample.ref,
        'ref:Hip-Hop-Hoerquiz_HB_Herbie-Hancock_Cantaloupe-Island#complete'
      )
    })

    it('Accessor “title”', async function () {
      assert.strictEqual(sample.title, 'komplett')
    })

    it('Accessor “titleSafe”', async function () {
      assert.strictEqual(sample.titleSafe, 'Cantaloupe Island')
    })

    it('Accessor “artistSafe”', async function () {
      assert.strictEqual(
        sample.artistSafe,
        '<em class="person">Herbie Hancock</em>'
      )
    })

    it('Property “yearSafe”', async function () {
      assert.strictEqual(sample.yearSafe, '1964')
    })

    it('Mixed mime types to test shortcuts', async function () {
      // ref:Biographie-Salzburg-Wien_HB_Sonate-a-moll-KV-310
      const audio = 'uuid:ac98bd34-5341-4fd6-b4f0-d83da7e1211e'

      // ref:Biographie-Salzburg-Wien_VD_Mozart-zu-spaet
      const video = 'uuid:91b77277-3d93-45c1-8a47-d0e76f29e413'

      // ref:Biographie-Salzburg-Wien_BD_Mozart_1777
      const image = 'uuid:74bd75ab-8505-4233-a9bf-70dd17c93e56'
      const resolver = new Resolver()
      await resolver.resolve([audio, video, image])

      assert.strictEqual(resolver.getSample(audio).shortcut, 'a 1')
      assert.strictEqual(resolver.getSample(video).shortcut, 'v 1')
      assert.strictEqual(resolver.getAsset(image).shortcut, 'i 1')
    })
  })
})
