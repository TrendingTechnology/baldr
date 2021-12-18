/* globals describe it */
const assert = require('assert')
const path = require('path')

const { buildPresentationData } = require('../dist/node/main.js')
const { getConfig } = require('@bldr/config')
const config = getConfig()

function getAbsPath (relPath) {
  return path.join(config.mediaServer.basePath, relPath)
}

describe('PresentationBuilder', function () {
  it('Property “.relPath”', async function () {
    const data = buildPresentationData(
      getAbsPath(
        'Musik/09/20_Kontext/20_Romantik/10_Programmmusik/20_Dukas-Zauberlehrling/Praesentation.baldr.yml'
      )
    )
    assert.strictEqual(
      data.meta.path,
      'Musik/09/20_Kontext/20_Romantik/10_Programmmusik/20_Dukas-Zauberlehrling/Praesentation.baldr.yml'
    )
  })
})
