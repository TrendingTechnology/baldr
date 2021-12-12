/* globals describe it */
const assert = require('assert')
const path = require('path')

const { readAssetFile } = require('../dist/node/main.js')
const { getConfig } = require('@bldr/config')
const config = getConfig()

function getAbsPath (relPath) {
  return path.join(config.mediaServer.basePath, relPath)
}

describe('Package “@bldr/media-data-collector”', function () {
  it('asset', async function () {
    const assetData = readAssetFile(
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
  })
})
