/* globals describe it */

import assert from 'assert'
import path from 'path'

import { getConfig } from '@bldr/config'

import { buildPresentationData } from '../dist/main.js'

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
