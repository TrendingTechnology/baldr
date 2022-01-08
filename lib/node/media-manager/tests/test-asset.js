/* globals describe it */

import assert from 'assert'
import path from 'path'
import fs from 'fs'

import { getConfig } from '@bldr/config'

import { operations } from '../dist/operations.js'

const config = getConfig()

function getPath (relPath) {
  return path.join(config.mediaServer.basePath, 'Musik', relPath)
}

describe('asset.ts', function () {
  it('Operation “renameByRef()”', function () {
    const testPath = getPath(
      '09/20_Kontext/20_Romantik/10_Programmmusik/35_Ausstellung/10_Ausstellung-Ueberblick/YT/sPg1qlLjUVQ.mp4'
    )
    operations.renameByRef(testPath)
    assert.ok(fs.existsSync(testPath))
  })
})
