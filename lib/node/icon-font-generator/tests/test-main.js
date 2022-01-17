/* globals describe it */

import assert from 'assert'
import fs from 'fs'
import path from 'path'

import { createTmpDir } from '@bldr/node-utils'
import { getConfig } from '@bldr/config'

import { createIconFont, setLogLevel } from '../dist/main'

const config = getConfig()
const tmpDir = createTmpDir()
const destDir = createTmpDir()

function assertExists (fileName) {
  assert.ok(fs.existsSync(path.join(destDir, fileName)))
}

describe('Package “@bldr/icon-font-generator”', function () {
  it('Function “createIconFont()”', async function () {
    this.timeout(3600 * 1000)

    config.iconFont.destPath = destDir
    setLogLevel(5)
    await createIconFont(config, tmpDir)

    assertExists('style.css')
    assertExists('icons.json')
    assertExists('baldr-icons.ttf')
    assertExists('baldr-icons.woff')
    assertExists('baldr-icons.woff2')
  })
})
