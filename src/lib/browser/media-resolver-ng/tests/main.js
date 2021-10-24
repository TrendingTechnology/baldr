/* globals describe it */

const assert = require('assert')

const { Resolver } = require('../dist/node/main.js')

describe('Package “@bldr/media-resolver”', function () {
  const httpUrlBase =
    'http://localhost/media/Musik/08/20_Mensch-Zeit/20_Popularmusik/70_Hip-Hop/30_Hip-Hop-Hoerquiz/HB/'
  let asset

  before(async function () {
    const resolver = new Resolver()
    // ref:Hip-Hop-Hoerquiz_HB_Herbie-Hancock_Cantaloupe-Island
    const assets = await resolver.resolve(
      'uuid:edd86315-64c1-445c-bcd3-b0dab14af112'
    )
    asset = assets[0]
  })

  describe('“ClientMediaAsset”', function () {
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

    describe('Class “SampleData”', function () {
      it('sample.title', function () {
        const sample = asset.samples.complete
        assert.strictEqual(sample.title, 'komplett')
      })
    })
  })
})
