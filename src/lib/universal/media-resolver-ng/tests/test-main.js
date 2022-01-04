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

  it('Recursive resolution', async function () {
    const resolver = new Resolver()
    await resolver.resolve('ref:PR_Mussorgski_Modest')
    const assets = resolver.exportAssets()
    assert.strictEqual(assets.length, 3)
    assert.strictEqual(assets[0].ref, 'ref:PR_Mussorgski_Modest')
    assert.strictEqual(
      assets[1].ref,
      'ref:Ausstellung-Ueberblick_HB_00_Orch_Promenade-I'
    )
    assert.strictEqual(
      assets[2].ref,
      'ref:Ausstellung-Ueberblick_HB_Ausstellung_Cover'
    )
  })

  describe('Samples', function () {
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

    it('samples from samples property', async function () {
      // ref:Grosses-Tor_HB_Orchester_Samples
      const resolver = new Resolver()
      await resolver.resolve('uuid:702ba259-349a-459f-bc58-cf1b0da37263')
      const sample = await resolver.resolveSample(
        'ref:Grosses-Tor_HB_Orchester_Samples#menschen'
      )
      assert.strictEqual(
        sample.ref,
        'ref:Grosses-Tor_HB_Orchester_Samples#menschen'
      )
    })

    it('default complete sample', async function () {
      // ref:Fuge-Opfer_HB_Ricercar-a-3
      const resolver = new Resolver()
      const sample = await resolver.resolveSample(
        'ref:Fuge-Opfer_HB_Ricercar-a-3#complete'
      )
      assert.strictEqual(sample.ref, 'ref:Fuge-Opfer_HB_Ricercar-a-3#complete')
      assert.strictEqual(sample.startTimeSec, 1)
    })

    it('sampleCache ref: Bolero_HB_Bolero', async function () {
      const resolver = new Resolver()
      // ref: Bolero_HB_Bolero
      await resolver.resolve('uuid:538204e4-6171-42d3-924c-b3f80a954a1a')
      const samples = resolver.exportSamples()
      assert.strictEqual(samples.length, 10)
    })

    it('sampleCache ref: Dylan-Hard-Rain_HB_A-Hard-Rain-s-a-Gonna-Fall', async function () {
      // ref: Dylan-Hard-Rain_HB_A-Hard-Rain-s-a-Gonna-Fall
      const resolver = new Resolver()
      await resolver.resolve('uuid:1eb60211-f3d5-45a1-a426-44926f14a32a')
      const samples = resolver.exportSamples()
      assert.strictEqual(samples.length, 7)
    })
  })

  describe('Class “Resolver()”', function () {
    it('Method “reset()”', async function () {
      const resolver = new Resolver()
      // ref: Bolero_HB_Bolero
      await resolver.resolve('uuid:538204e4-6171-42d3-924c-b3f80a954a1a')
      assert.strictEqual(resolver.exportAssets().length, 1)
      assert.strictEqual(resolver.exportSamples().length, 10)
      resolver.reset()
      assert.strictEqual(resolver.exportAssets().length, 0)
      assert.strictEqual(resolver.exportSamples().length, 0)
    })

    describe('Method “getAsset()”', function () {
      it('ref:', async function () {
        const asset = await resolver.resolveAsset(
          'ref:Hip-Hop-Hoerquiz_HB_Herbie-Hancock_Cantaloupe-Island'
        )
        assert.strictEqual(
          asset.uuid,
          'uuid:edd86315-64c1-445c-bcd3-b0dab14af112'
        )
      })

      it('ref:#complete', async function () {
        const asset = await resolver.resolveAsset(
          'ref:Hip-Hop-Hoerquiz_HB_Herbie-Hancock_Cantaloupe-Island#complete'
        )
        assert.ok(asset != null)
      })

      it('ref:#xxx', async function () {
        const asset = await resolver.resolveAsset(
          'ref:Hip-Hop-Hoerquiz_HB_Herbie-Hancock_Cantaloupe-Island#xxx'
        )
        assert.ok(asset != null)
      })

      it('uuid:', async function () {
        // ref:Hip-Hop-Hoerquiz_HB_Herbie-Hancock_Cantaloupe-Island
        const asset = await resolver.resolveAsset(
          'uuid:edd86315-64c1-445c-bcd3-b0dab14af112'
        )
        assert.strictEqual(
          asset.uuid,
          'uuid:edd86315-64c1-445c-bcd3-b0dab14af112'
        )
      })
    })

    describe('Resolve URI with fragments', function () {
      const resolver = new Resolver()
      // ref: 'Ausstellung-Ueberblick_HB_10_Klav_Grosses-Tor-von-Kiew',
      // uuid: 'c64047d2-983d-4009-a35f-02c95534cb53',

      it('uuid without a fragment', async function () {
        const assets = await resolver.resolve(
          'uuid:c64047d2-983d-4009-a35f-02c95534cb53'
        )
        assert.strictEqual(
          assets[0].uuid,
          'uuid:c64047d2-983d-4009-a35f-02c95534cb53'
        )
      })

      it('ref without a fragment', async function () {
        const assets = await resolver.resolve(
          'ref:Ausstellung-Ueberblick_HB_10_Klav_Grosses-Tor-von-Kiew'
        )
        assert.strictEqual(
          assets[0].uuid,
          'uuid:c64047d2-983d-4009-a35f-02c95534cb53'
        )
      })

      it('uuid with a fragment', async function () {
        const assets = await resolver.resolve(
          'uuid:c64047d2-983d-4009-a35f-02c95534cb53#complete'
        )
        assert.strictEqual(
          assets[0].uuid,
          'uuid:c64047d2-983d-4009-a35f-02c95534cb53'
        )
      })

      it('ref with a fragment', async function () {
        const assets = await resolver.resolve(
          'ref:Ausstellung-Ueberblick_HB_10_Klav_Grosses-Tor-von-Kiew#complete'
        )
        assert.strictEqual(
          assets[0].uuid,
          'uuid:c64047d2-983d-4009-a35f-02c95534cb53'
        )
      })
    })
  })

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

  describe('Class “Sample”', function () {
    let sample
    beforeEach(async function () {
      // ref:Hip-Hop-Hoerquiz_HB_Herbie-Hancock_Cantaloupe-Island
      sample = await resolver.resolveSample(
        'uuid:edd86315-64c1-445c-bcd3-b0dab14af112'
      )
    })

    it('sample.title', async function () {
      assert.strictEqual(sample.title, 'komplett')
    })

    it('Mixed mime types to test shortcuts', async function () {
      // ref:Biographie-Salzburg-Wien_HB_Sonate-a-moll-KV-310
      // uuid:ac98bd34-5341-4fd6-b4f0-d83da7e1211e

      // ref:Biographie-Salzburg-Wien_VD_Mozart-zu-spaet
      // uuid:91b77277-3d93-45c1-8a47-d0e76f29e413

      // ref:Biographie-Salzburg-Wien_BD_Mozart_1777
      // uuid:74bd75ab-8505-4233-a9bf-70dd17c93e56
      const resolver = new Resolver()
      await resolver.resolve([
        'uuid:ac98bd34-5341-4fd6-b4f0-d83da7e1211e',
        'uuid:91b77277-3d93-45c1-8a47-d0e76f29e413',
        'uuid:74bd75ab-8505-4233-a9bf-70dd17c93e56'
      ])

      const samples = resolver.exportSamples()
      assert.strictEqual(samples[0].shortcut, 'a 1')
      assert.strictEqual(samples[1].shortcut, 'v 1')

      const assets = resolver.exportAssets()
      assert.strictEqual(assets[2].shortcut, 'i 1')
    })
  })
})
