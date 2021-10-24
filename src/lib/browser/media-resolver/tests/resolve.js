/* globals describe it */

const assert = require('assert')

const {
  assetCache,
  sampleCache,
  resetMediaCache
} = require('../dist/node/cache.js')
const { resolve } = require('../dist/node/resolve.js')

const { resolveSingleByUuid, resolveByUuid } = require('./_helper.js')

describe('Package “@bldr/media-resolver”: File “resolve.js”', function () {

  describe('Samples', function () {
    it('samples from samples property', async function () {
      // ref:Grosses-Tor_HB_Orchester_Samples
      const asset = await resolveSingleByUuid(
        '702ba259-349a-459f-bc58-cf1b0da37263'
      )
      const samples = asset.samples
      const sample = samples.get(
        'ref:Grosses-Tor_HB_Orchester_Samples#menschen'
      )
      assert.strictEqual(
        sample.ref,
        'ref:Grosses-Tor_HB_Orchester_Samples#menschen'
      )
    })

    it('default complete sample', async function () {
      // ref:Fuge-Opfer_HB_Ricercar-a-3
      const asset = await resolveSingleByUuid(
        '30a285e1-1fc1-418f-af6d-89cd37c0438d'
      )
      const samples = asset.samples
      const sample = samples.get('ref:Fuge-Opfer_HB_Ricercar-a-3#complete')
      assert.strictEqual(sample.ref, 'ref:Fuge-Opfer_HB_Ricercar-a-3#complete')
      assert.strictEqual(sample.startTimeSec, 1)
    })
  })

  describe('Property htmlElement', function () {
    it('No htmlElement on document asset', async function () {
      // ref:Arbeiterlied-Weber_QL_Tonart_Schuelerband
      const asset = await resolveSingleByUuid(
        '274796f6-1a41-40ad-afa4-2f39ad24563a'
      )
      assert.strictEqual(asset.htmlElement, undefined)
    })

    it('htmlElement on audio asset', async function () {
      // ref:Schuetz-Freue_HB_Freue-dich
      const asset = await resolveSingleByUuid(
        '02dcf8df-8f34-4b0d-b121-32b0f54cfd74'
      )
      assert.strictEqual(asset.htmlElement.constructor.name, 'HTMLAudioElement')
    })
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
      assert.strictEqual(
        assets[0].uuid,
        'uuid:c64047d2-983d-4009-a35f-02c95534cb53'
      )
    })

    it('ref without a fragment', async function () {
      const assets = await resolve(
        'ref:Ausstellung-Ueberblick_HB_10_Klav_Grosses-Tor-von-Kiew'
      )
      assert.strictEqual(
        assets[0].uuid,
        'uuid:c64047d2-983d-4009-a35f-02c95534cb53'
      )
    })

    it('uuid with a fragment', async function () {
      const assets = await resolve(
        'uuid:c64047d2-983d-4009-a35f-02c95534cb53#complete'
      )
      assert.strictEqual(
        assets[0].uuid,
        'uuid:c64047d2-983d-4009-a35f-02c95534cb53'
      )
    })

    it('ref with a fragment', async function () {
      const assets = await resolve(
        'ref:Ausstellung-Ueberblick_HB_10_Klav_Grosses-Tor-von-Kiew#complete'
      )
      assert.strictEqual(
        assets[0].uuid,
        'uuid:c64047d2-983d-4009-a35f-02c95534cb53'
      )
    })
  })
})
