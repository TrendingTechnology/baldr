/* globals describe it */

const assert = require('assert')
const path = require('path')

const collectAudioMetaData = require('../dist/node/main.js')
const config = require('@bldr/config')

describe('Package “@bldr/audio-metadata”', function () {
  it('Methode “collectAudioMetaData()”', async function () {
    const meta = await collectAudioMetaData(
      path.join(
        config.mediaServer.basePath,
        'Musik/08/20_Mensch-Zeit/20_Popularmusik/70_Hip-Hop/30_Hip-Hop-Hoerquiz/HB/Herbie-Hancock_Cantaloupe-Island.mp3'
      )
    )
    assert.strictEqual(meta.title, 'Cantaloupe Island: Cantaloupe Island')
    assert.strictEqual(meta.duration, 330.13551020408164)
    assert.strictEqual(meta.composer, 'Herbie Hancock')
  })
})
