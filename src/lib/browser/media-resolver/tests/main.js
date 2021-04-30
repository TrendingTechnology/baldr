const assert = require('assert')

const { Resolver, assetCache } = require('../dist/node/main.js')

const resolver = new Resolver()
describe('Package “@bldr/media-resolver”', function () {

  it('resolve single', async function () {
    const assets = await resolver.resolve('uuid:c64047d2-983d-4009-a35f-02c95534cb53')
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
      const assets = await resolver.resolve('uuid:702ba259-349a-459f-bc58-cf1b0da37263')
      const samples = assets[0].samples
      const sample = samples.get('menschen')
      assert.strictEqual(sample.ref, 'menschen')
    })

    it('default complete sample', async function () {
      // ref:Fuge-Opfer_HB_Ricercar-a-3
      const assets = await resolver.resolve('uuid:30a285e1-1fc1-418f-af6d-89cd37c0438d')
      const samples = assets[0].samples
      const sample = samples.get('complete')
      assert.strictEqual(sample.ref, 'complete')
      assert.strictEqual(sample.startTimeSec, 1)
    })
  })
})
