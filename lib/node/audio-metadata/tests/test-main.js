/* globals describe it */

import assert from 'assert'
import path from 'path'
import fs from 'fs'

import { createTmpDir } from '@bldr/node-utils'
import { getConfig } from '@bldr/config'

import { collectAudioMetadata, extractCoverImage } from '../dist/main'

const config = getConfig()

function getPath (relPath) {
  return path.join(config.mediaServer.basePath, 'Musik', relPath)
}

describe('Package “@bldr/audio-metadata”', function () {
  describe('Methode “collectAudioMetadata()”', function () {
    it('HB/Herbie-Hancock_Cantaloupe-Island.mp3', async function () {
      const meta = await collectAudioMetadata(
        getPath(
          '08/20_Mensch-Zeit/20_Popularmusik/70_Hip-Hop/30_Hip-Hop-Hoerquiz/HB/Herbie-Hancock_Cantaloupe-Island.mp3'
        )
      )
      assert.strictEqual(meta.title, 'Cantaloupe Island: Cantaloupe Island')
      assert.strictEqual(meta.duration, 330.13551020408164)
      assert.strictEqual(meta.composer, 'Herbie Hancock')
    })

    it('10_Haydn-Sonate-G-Dur/HB/Sonate-G-Dur-I-Allegro.mp3', async function () {
      const meta = await collectAudioMetadata(
        getPath(
          '09/20_Mensch-Zeit/10_Klassik/30_Sonatensatz/10_Haydn-Sonate-G-Dur/HB/Sonate-G-Dur-I-Allegro.mp3'
        )
      )
      assert.strictEqual(
        meta.musicbrainz_recording_id,
        '75930cdb-daf4-4f01-af8c-a8f08f46d0cf'
      )
      assert.strictEqual(
        meta.musicbrainz_work_id,
        '5f5bef58-537c-4b64-92aa-958d6039ce6d'
      )
      assert.strictEqual(meta.artist, 'Joseph Haydn; Rudolf Buchbinder')
    })
  })

  it('Method “extractCoverImage()”', async function () {
    const destPath = path.join(createTmpDir(), 'cover.jpg')
    await extractCoverImage(
      getPath(
        '10/10_Kontext/40_Jazz/30_Stile/10_New-Orleans-Dixieland/HB/Dippermouth-Blues_Wynton-Marsalis.m4a'
      ),
      destPath
    )
    assert.ok(fs.existsSync(destPath))
  })
})
