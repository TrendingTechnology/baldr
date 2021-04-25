const assert = require('assert')

const { Resolver } = require('../dist/node/main.js')

const resolver = new Resolver()
describe('Package “@bldr/media-resolver”', function () {

  it('resolve single', async function () {
    const assets = await resolver.resolve('uuid:c64047d2-983d-4009-a35f-02c95534cb53')
    // 09/20_Kontext/20_Romantik/10_Programmmusik/35_Ausstellung/10_Ausstellung-Ueberblick/HB/10_Klav_Grosses-Tor-von-Kiew.m4a
    assert.strictEqual(assets[0].uri.raw, 'uuid:c64047d2-983d-4009-a35f-02c95534cb53')
    // Linked over cover: uuid:
    // 09/20_Kontext/20_Romantik/10_Programmmusik/35_Ausstellung/10_Ausstellung-Ueberblick/HB/Ausstellung_Cover.jpg
    assert.strictEqual(assets[1].uri.raw, 'uuid:e14ad479-3c2a-497a-a5f3-c30ea7dcb8b9')
  })

})
