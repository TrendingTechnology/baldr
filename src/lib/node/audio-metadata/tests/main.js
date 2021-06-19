/* globals describe it */

const assert = require('assert')

const collectAudioMetaData = require('../dist/node/main.js')

describe('Package “@bldr/audio-metadata”', function () {
  it('Methode “collectAudioMetaData()”', async function () {
    const meta = await collectAudioMetaData('/home/jf/schule-media/08/20_Mensch-Zeit/20_Popularmusik/70_Hip-Hop/30_Hip-Hop-Hoerquiz/HB/Herbie-Hancock_Cantaloupe-Island.mp3')
    assert.strictEqual(meta.title, 'Cantaloupe Island: Cantaloupe Island')
    assert.strictEqual(meta.duration, 330.13551020408164)
    assert.strictEqual(meta.composer, 'Herbie Hancock')
  })
})
