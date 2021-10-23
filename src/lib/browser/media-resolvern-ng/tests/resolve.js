/* globals describe it */

const assert = require('assert')

const { assetCache, sampleCache, resetMediaCache } = require('../dist/node/cache.js')
const { resolve } = require('../dist/node/resolve.js')

const { resolveSingleByUuid, resolveByUuid } = require('./_helper.js')

describe('Package “@bldr/media-resolver”: File “resolve.js”', function () {
  it('resolve single', async function () {
    const assets = await resolveByUuid('c64047d2-983d-4009-a35f-02c95534cb53')
    // 09/20_Kontext/20_Romantik/10_Programmmusik/35_Ausstellung/10_Ausstellung-Ueberblick/HB/10_Klav_Grosses-Tor-von-Kiew.m4a
    assert.strictEqual(assets[0].uri.raw, 'uuid:c64047d2-983d-4009-a35f-02c95534cb53')
    // Linked over cover: uuid:
    // 09/20_Kontext/20_Romantik/10_Programmmusik/35_Ausstellung/10_Ausstellung-Ueberblick/HB/Ausstellung_Cover.jpg
    assert.strictEqual(assets[1].uri.raw, 'uuid:e14ad479-3c2a-497a-a5f3-c30ea7dcb8b9')
    const cachedAssets = assetCache.getAll()
    assert.strictEqual(cachedAssets.length, 2)
  })

  describe('Samples', function () {
    it('samples from samples property', async function () {
      // ref:Grosses-Tor_HB_Orchester_Samples
      const asset = await resolveSingleByUuid('702ba259-349a-459f-bc58-cf1b0da37263')
      const samples = asset.samples
      const sample = samples.get('ref:Grosses-Tor_HB_Orchester_Samples#menschen')
      assert.strictEqual(sample.ref, 'ref:Grosses-Tor_HB_Orchester_Samples#menschen')
    })

    it('default complete sample', async function () {
      // ref:Fuge-Opfer_HB_Ricercar-a-3
      const asset = await resolveSingleByUuid('30a285e1-1fc1-418f-af6d-89cd37c0438d')
      const samples = asset.samples
      const sample = samples.get('ref:Fuge-Opfer_HB_Ricercar-a-3#complete')
      assert.strictEqual(sample.ref, 'ref:Fuge-Opfer_HB_Ricercar-a-3#complete')
      assert.strictEqual(sample.startTimeSec, 1)
    })
  })

  describe('Property htmlElement', function () {
    it('No htmlElement on document asset', async function () {
      // ref:Arbeiterlied-Weber_QL_Tonart_Schuelerband
      const asset = await resolveSingleByUuid('274796f6-1a41-40ad-afa4-2f39ad24563a')
      assert.strictEqual(asset.htmlElement, undefined)
    })

    it('htmlElement on audio asset', async function () {
      // ref:Schuetz-Freue_HB_Freue-dich
      const asset = await resolveSingleByUuid('02dcf8df-8f34-4b0d-b121-32b0f54cfd74')
      assert.strictEqual(asset.htmlElement.constructor.name, 'HTMLAudioElement')
    })
  })

  it('Samples shortcuts', async function () {
    resetMediaCache()
    // ref: Stars-on-45_HB_Stars-on-45
    const asset = await resolveSingleByUuid('6a3c5972-b039-4faa-ad3f-3152b2413b65')
    const samples = asset.samples.getAll()
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

  it('sampleCache ref: Bolero_HB_Bolero', async function () {
    resetMediaCache()
    // ref: Bolero_HB_Bolero
    await resolveSingleByUuid('538204e4-6171-42d3-924c-b3f80a954a1a')
    const samples = sampleCache.getAll()
    assert.strictEqual(samples.length, 10)
    assert.strictEqual(sampleCache.size, 10)
  })

  it('sampleCache ref: Dylan-Hard-Rain_HB_A-Hard-Rain-s-a-Gonna-Fall', async function () {
    resetMediaCache()
    // ref: Dylan-Hard-Rain_HB_A-Hard-Rain-s-a-Gonna-Fall
    await resolveSingleByUuid('1eb60211-f3d5-45a1-a426-44926f14a32a')
    const samples = sampleCache.getAll()
    assert.strictEqual(samples.length, 7)
    assert.strictEqual(sampleCache.size, 7)
  })

  describe('Resolve URI with fragments', function () {
    // ref: 'Ausstellung-Ueberblick_HB_10_Klav_Grosses-Tor-von-Kiew',
    // uuid: 'c64047d2-983d-4009-a35f-02c95534cb53',

    it('uuid without a fragment', async function () {
      const assets = await resolve('uuid:c64047d2-983d-4009-a35f-02c95534cb53')
      assert.strictEqual(assets[0].uuid, 'uuid:c64047d2-983d-4009-a35f-02c95534cb53')
    })

    it('ref without a fragment', async function () {
      const assets = await resolve('ref:Ausstellung-Ueberblick_HB_10_Klav_Grosses-Tor-von-Kiew')
      assert.strictEqual(assets[0].uuid, 'uuid:c64047d2-983d-4009-a35f-02c95534cb53')
    })

    it('uuid with a fragment', async function () {
      const assets = await resolve('uuid:c64047d2-983d-4009-a35f-02c95534cb53#complete')
      assert.strictEqual(assets[0].uuid, 'uuid:c64047d2-983d-4009-a35f-02c95534cb53')
    })

    it('ref with a fragment', async function () {
      const assets = await resolve('ref:Ausstellung-Ueberblick_HB_10_Klav_Grosses-Tor-von-Kiew#complete')
      assert.strictEqual(assets[0].uuid, 'uuid:c64047d2-983d-4009-a35f-02c95534cb53')
    })
  })
})
