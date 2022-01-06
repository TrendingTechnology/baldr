/* globals describe it beforeEach */

const assert = require('assert')

const { Resolver } = require('../dist/node/main.js')
const resolver = new Resolver()

describe('File “asset.ts”', function () {
  describe('Class “Asset”', function () {
    const httpUrlBase =
      'http://localhost/media/Musik/08/20_Mensch-Zeit/20_Popularmusik/70_Hip-Hop/30_Hip-Hop-Hoerquiz/HB/'
    let asset

    beforeEach(async function () {
      // ref:Hip-Hop-Hoerquiz_HB_Herbie-Hancock_Cantaloupe-Island
      asset = await resolver.resolveAsset(
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

    it('asset.waveformHttpUrl: undefined document ref:Hip-Hop-Hoerquiz_QL_RAAbits', async function () {
      const asset = await resolver.resolveAsset(
        'uuid:c8c0f0e3-744e-4a22-b16f-b98695159d32'
      )
      assert.ok(asset != null)
      assert.strictEqual(asset.waveformHttpUrl, undefined)
    })
  })
})
