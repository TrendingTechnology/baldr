/* globals describe it */

const assert = require('assert')

const { Resolver } = require('../dist/node/main.js')
const resolver = new Resolver()

describe('Package “@bldr/media-resolver”', function () {
  describe('Class “Resolver()”', function () {
    describe('Method “getAsset()”', function () {
      it('ref:', async function () {
        asset = await resolver.getAsset(
          'ref:Hip-Hop-Hoerquiz_HB_Herbie-Hancock_Cantaloupe-Island'
        )
        assert.strictEqual(
          asset.uuid,
          'uuid:edd86315-64c1-445c-bcd3-b0dab14af112'
        )
      })

      it('ref:#complete', async function () {
        asset = await resolver.getAsset(
          'ref:Hip-Hop-Hoerquiz_HB_Herbie-Hancock_Cantaloupe-Island#complete'
        )
        assert.ok(asset != null)
      })

      it('ref:#xxx', async function () {
        asset = await resolver.getAsset(
          'ref:Hip-Hop-Hoerquiz_HB_Herbie-Hancock_Cantaloupe-Island#xxx'
        )
        assert.ok(asset != null)
      })

      it('uuid:', async function () {
        // ref:Hip-Hop-Hoerquiz_HB_Herbie-Hancock_Cantaloupe-Island
        asset = await resolver.getAsset(
          'uuid:edd86315-64c1-445c-bcd3-b0dab14af112'
        )
        assert.strictEqual(
          asset.uuid,
          'uuid:edd86315-64c1-445c-bcd3-b0dab14af112'
        )
      })
    })
  })

  describe('Class “ClientMediaAsset”', function () {
    const httpUrlBase =
      'http://localhost/media/Musik/08/20_Mensch-Zeit/20_Popularmusik/70_Hip-Hop/30_Hip-Hop-Hoerquiz/HB/'
    let asset

    beforeEach(async function () {
      // ref:Hip-Hop-Hoerquiz_HB_Herbie-Hancock_Cantaloupe-Island
      asset = await resolver.getAsset(
        'uuid:edd86315-64c1-445c-bcd3-b0dab14af112'
      )
    })

    it('asset.ref', function () {
      assert.strictEqual(
        asset.ref,
        'ref:Hip-Hop-Hoerquiz_HB_Herbie-Hancock_Cantaloupe-Island'
      )
    })

    it('asset.uuid', function () {
      assert.strictEqual(
        asset.uuid,
        'uuid:edd86315-64c1-445c-bcd3-b0dab14af112'
      )
    })

    it('asset.previewHttpUrl', function () {
      assert.strictEqual(
        asset.previewHttpUrl,
        httpUrlBase + 'Herbie-Hancock_Cantaloupe-Island.mp3_preview.jpg'
      )
    })

    it('asset.waveformHttpUrl', function () {
      assert.strictEqual(
        asset.waveformHttpUrl,
        httpUrlBase + 'Herbie-Hancock_Cantaloupe-Island.mp3_waveform.png'
      )
    })
  })

  describe('Class “SampleData”', function () {
    let sample
    beforeEach(async function () {
      // ref:Hip-Hop-Hoerquiz_HB_Herbie-Hancock_Cantaloupe-Island
      sample = await resolver.getSample(
        'uuid:edd86315-64c1-445c-bcd3-b0dab14af112'
      )
    })

    it('sample.title', async function () {
      assert.strictEqual(sample.title, 'komplett')
    })
  })
})
