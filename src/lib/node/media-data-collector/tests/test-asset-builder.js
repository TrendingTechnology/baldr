/* globals describe it */
const assert = require('assert')
const path = require('path')

const {
  buildDbAssetData,
  buildMinimalAssetData
} = require('../dist/node/main.js')
const { getConfig } = require('@bldr/config')
const config = getConfig()

function getAbsPath (relPath) {
  return path.join(config.mediaServer.basePath, relPath)
}

describe('Build asset data', function () {
  describe('Function “buildDbAssetData”()', function () {
    it('Asset properties “.relPath”, “.ref”, “.uuid”', async function () {
      const assetData = buildDbAssetData(
        getAbsPath(
          'Musik/06/20_Mensch-Zeit/10_Bach/20_Kantate/NB/Aufsteigende-Melodie.svg'
        )
      )
      assert.strictEqual(
        assetData.relPath,
        'Musik/06/20_Mensch-Zeit/10_Bach/20_Kantate/NB/Aufsteigende-Melodie.svg'
      )
      assert.strictEqual(assetData.ref, 'Kantate_NB_Aufsteigende-Melodie')
      assert.strictEqual(assetData.uuid, 'a5c3def5-afec-498a-8238-11a564d2f9b5')
      assert.strictEqual(assetData.hasWaveform, undefined)
      assert.strictEqual(assetData.hasPreview, undefined)
    })

    it('Asset property “.hasWaveform”', async function () {
      const assetData = buildDbAssetData(
        getAbsPath(
          'Musik/09/20_Mensch-Zeit/10_Klassik/30_Sonatensatz/10_Haydn-Sonate-G-Dur/HB/Sonate-G-Dur-I-Allegro.mp3'
        )
      )
      assert.strictEqual(assetData.hasWaveform, true)
    })

    it('Asset property “.hasPreview”', async function () {
      const assetData = buildDbAssetData(
        getAbsPath(
          'Musik/09/20_Mensch-Zeit/10_Klassik/30_Sonatensatz/20_Mozart-Sinfonie-40-g-Moll/HB/1-Molto-allegro.mp3'
        )
      )
      assert.strictEqual(assetData.hasPreview, true)
    })

    it('Asset property “.multiPartCount”', async function () {
      const assetData = buildDbAssetData(
        getAbsPath(
          'Musik/11/20_Religion/30_Affektdarstellung/20_Schuetz-Freue/NB/Freue-IMSLP-Systeme.png'
        )
      )
      assert.strictEqual(assetData.multiPartCount, 16)
    })

    it('Asset property “.mimeType”', async function () {
      const assetData = buildDbAssetData(
        getAbsPath(
          'Musik/11/20_Religion/30_Affektdarstellung/20_Schuetz-Freue/NB/Freue-IMSLP-Systeme.png'
        )
      )
      assert.strictEqual(assetData.mimeType, 'image')
    })
  })

  it('Function “buildMinimalAssetData()”', function () {
    const assetData = buildMinimalAssetData(
      getAbsPath(
        'Musik/11/20_Religion/30_Affektdarstellung/20_Schuetz-Freue/NB/Freue-IMSLP-Systeme.png'
      )
    )
    assert.strictEqual(assetData.relPath, undefined)
    assert.strictEqual(assetData.uuid, 'a3fdc611-57e6-452b-9058-248836504048')
  })
})
