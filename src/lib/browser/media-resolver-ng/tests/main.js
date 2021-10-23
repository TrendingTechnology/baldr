/* globals describe it */

const assert = require('assert')

const { Resolver } = require('../dist/node/main.js')

describe('Package “@bldr/media-resolver”', function () {
  it('“ClientMediaAsset”', async function () {
    const resolver = new Resolver()
    // ref:Hip-Hop-Hoerquiz_HB_Herbie-Hancock_Cantaloupe-Island
    const assets = await resolver.resolve(
      'uuid:edd86315-64c1-445c-bcd3-b0dab14af112'
    )
    const asset = assets[0]

    const httpUrlBase =
      'http://localhost/media/Musik/08/20_Mensch-Zeit/20_Popularmusik/70_Hip-Hop/30_Hip-Hop-Hoerquiz/HB/'

    assert.strictEqual(
      asset.ref,
      'ref:Hip-Hop-Hoerquiz_HB_Herbie-Hancock_Cantaloupe-Island'
    )

    assert.strictEqual(asset.uuid, 'uuid:edd86315-64c1-445c-bcd3-b0dab14af112')

    assert.strictEqual(
      asset.previewHttpUrl,
      httpUrlBase + 'Herbie-Hancock_Cantaloupe-Island.mp3_preview.jpg'
    )

    assert.strictEqual(
      asset.waveformHttpUrl,
      httpUrlBase + 'Herbie-Hancock_Cantaloupe-Island.mp3_waveform.png'
    )
  })
})
