/* globals describe it */
import assert from 'assert'
import path from 'path'
import fs from 'fs'

import { getConfig } from '@bldr/config'

import {
  getDirname,
  findParentFile,
  getBasename,
  getTmpDirPath,
  getGitHead,
  createTmpDir,
  copyToTmp
} from '../dist/main'

const config = getConfig()

describe('Package “@bldr/core-node”', function () {
  it('function  “findParentFile()”', function () {
    const testFile = path.join(
      config.mediaServer.basePath,
      'Musik/05/40_Grundlagen/97_Instrumente/07_Hoer-Labyrinth/TX/Arbeitsblatt.tex'
    )
    assert.strictEqual(
      findParentFile(testFile, 'title.txt'),
      path.join(
        config.mediaServer.basePath,
        'Musik/05/40_Grundlagen/97_Instrumente/07_Hoer-Labyrinth/title.txt'
      )
    )
  })

  it('Function “getBasename()”', function () {
    assert.strictEqual(
      getBasename('07_Hoer-Labyrinth/TX/Arbeitsblatt.tex'),
      'Arbeitsblatt'
    )
  })

  it('Function “getTmpDirPath()”', function () {
    assert.ok(getTmpDirPath().includes('baldr'))
  })

  it('Function “createTmpDir()”', function () {
    const dir = createTmpDir()
    const stat = fs.statSync(dir)
    assert.ok(stat.isDirectory())
  })

  it('Function “copyToTmp()”', function () {
    const dest = copyToTmp(getDirname(import.meta), '..', 'package.json')
    const stat = fs.statSync(dest)
    assert.ok(fs.existsSync(dest))
    assert.ok(stat.isFile())
  })

  it('Function “getGitHead()”', function () {
    const head = getGitHead()
    assert.strictEqual(head.short.length, 7)
    assert.strictEqual(head.long.length, 40)
    assert.strictEqual(typeof head.isDirty, 'boolean')
  })
})
