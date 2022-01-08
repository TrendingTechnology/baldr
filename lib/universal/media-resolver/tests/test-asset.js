/* globals describe it beforeEach */

const assert = require('assert')

const { Resolver } = require('../dist/main.js')
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

    it('Accessor “ref”', function () {
      assert.strictEqual(
        asset.ref,
        'ref:Hip-Hop-Hoerquiz_HB_Herbie-Hancock_Cantaloupe-Island'
      )
    })

    it('Accessor “uuid“', function () {
      assert.strictEqual(
        asset.uuid,
        'uuid:edd86315-64c1-445c-bcd3-b0dab14af112'
      )
    })

    it('Accessor “previewHttpUrl“', function () {
      assert.strictEqual(
        asset.previewHttpUrl,
        httpUrlBase + 'Herbie-Hancock_Cantaloupe-Island.mp3_preview.jpg'
      )
    })

    describe('Accessor “waveformHttpUrl“', function () {
      it('present', function () {
        assert.strictEqual(
          asset.waveformHttpUrl,
          httpUrlBase + 'Herbie-Hancock_Cantaloupe-Island.mp3_waveform.png'
        )
      })

      it('undefined document ref:Hip-Hop-Hoerquiz_QL_RAAbits', async function () {
        const asset = await resolver.resolveAsset(
          'uuid:c8c0f0e3-744e-4a22-b16f-b98695159d32'
        )
        assert.ok(asset != null)
        assert.strictEqual(asset.waveformHttpUrl, undefined)
      })
    })

    it('Accessor “titleSafe“', function () {
      assert.strictEqual(asset.titleSafe, 'Cantaloupe Island')
    })

    it('Accessor “isPlayable“', function () {
      assert.strictEqual(asset.isPlayable, true)
    })

    it('Accessor “isVisible“', function () {
      assert.strictEqual(asset.isVisible, false)
    })

    it('Accessor “multiPartCount“', function () {
      assert.strictEqual(asset.multiPartCount, 1)
    })

    describe('Method “getMultiPartHttpUrlByNo()“', function () {
      it('URL by no = 1', function () {
        assert.strictEqual(
          asset.getMultiPartHttpUrlByNo(1),
          httpUrlBase + 'Herbie-Hancock_Cantaloupe-Island.mp3'
        )
      })

      it('URL by no = 2: same as no = 1', function () {
        assert.strictEqual(
          asset.getMultiPartHttpUrlByNo(2),
          httpUrlBase + 'Herbie-Hancock_Cantaloupe-Island.mp3'
        )
      })
    })
  })
})
