/* globals describe it beforeEach */

const assert = require('assert')

const { Resolver } = require('../dist/node/main.js')
const resolver = new Resolver()

describe('Package “@bldr/media-resolver”', function () {
  it('Linked over cover', async function () {
    const resolver = new Resolver()
    await resolver.resolve('uuid:c64047d2-983d-4009-a35f-02c95534cb53')
    const assets = resolver.exportAssets()

    // 09/20_Kontext/20_Romantik/10_Programmmusik/35_Ausstellung/10_Ausstellung-Ueberblick/HB/10_Klav_Grosses-Tor-von-Kiew.m4a
    assert.strictEqual(
      assets[0].uri.raw,
      'uuid:c64047d2-983d-4009-a35f-02c95534cb53'
    )
    // Linked over cover: uuid:
    // 09/20_Kontext/20_Romantik/10_Programmmusik/35_Ausstellung/10_Ausstellung-Ueberblick/HB/Ausstellung_Cover.jpg
    assert.strictEqual(
      assets[1].uri.raw,
      'uuid:e14ad479-3c2a-497a-a5f3-c30ea7dcb8b9'
    )
    assert.strictEqual(assets.length, 2)
  })

  it('Samples shortcuts', async function () {
    // ref: Stars-on-45_HB_Stars-on-45
    const resolver = new Resolver()
    await resolver.resolve('uuid:6a3c5972-b039-4faa-ad3f-3152b2413b65')
    const samples = resolver.exportSamples()
    assert.strictEqual(samples[0].shortcut, 'a 1')
    assert.strictEqual(samples[1].shortcut, 'a 2')
    assert.strictEqual(samples[2].shortcut, 'a 3')
    assert.strictEqual(samples[3].shortcut, 'a 4')
    assert.strictEqual(samples[4].shortcut, 'a 5')
    assert.strictEqual(samples[5].shortcut, 'a 6')
    assert.strictEqual(samples[6].shortcut, 'a 7')
    assert.strictEqual(samples[7].shortcut, 'a 8')
    assert.strictEqual(samples[8].shortcut, 'a 9')
    assert.strictEqual(samples[9].shortcut, 'a 0')
    assert.strictEqual(samples[10].shortcut, undefined)
  })

  describe('Class “Resolver()”', function () {
    describe('Method “getAsset()”', function () {
      it('ref:', async function () {
        const asset = await resolver.getAsset(
          'ref:Hip-Hop-Hoerquiz_HB_Herbie-Hancock_Cantaloupe-Island'
        )
        assert.strictEqual(
          asset.uuid,
          'uuid:edd86315-64c1-445c-bcd3-b0dab14af112'
        )
      })

      it('ref:#complete', async function () {
        const asset = await resolver.getAsset(
          'ref:Hip-Hop-Hoerquiz_HB_Herbie-Hancock_Cantaloupe-Island#complete'
        )
        assert.ok(asset != null)
      })

      it('ref:#xxx', async function () {
        const asset = await resolver.getAsset(
          'ref:Hip-Hop-Hoerquiz_HB_Herbie-Hancock_Cantaloupe-Island#xxx'
        )
        assert.ok(asset != null)
      })

      it('uuid:', async function () {
        // ref:Hip-Hop-Hoerquiz_HB_Herbie-Hancock_Cantaloupe-Island
        const asset = await resolver.getAsset(
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

    it('asset.waveformHttpUrl: undefined document ref:Hip-Hop-Hoerquiz_QL_RAAbits', async function () {
      const asset = await resolver.getAsset(
        'uuid:c8c0f0e3-744e-4a22-b16f-b98695159d32'
      )
      assert.ok(asset != null)
      assert.strictEqual(asset.waveformHttpUrl, undefined)
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
