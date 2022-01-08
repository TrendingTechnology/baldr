/* globals describe it */

const assert = require('assert')

const { Resolver } = require('../dist/main.js')

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
})
