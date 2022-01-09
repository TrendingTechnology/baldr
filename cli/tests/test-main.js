/* globals describe it */

import assert from 'assert'
import childProcess from 'child_process'
import fs from 'fs'
import path from 'path'

import { createTmpDir, getDirname } from '@bldr/core-node'

function exec (...args) {
  const p = childProcess.spawnSync('baldr', args, {
    encoding: 'utf-8'
  })
  return p.stdout
}

describe('Package “@bldr/cli”', function () {
  it('--help', async function () {
    const stdout = exec('--help')
    assert.ok(stdout.includes('--help'))
  })

  it('Short command “b”', async function () {
    const process = childProcess.spawnSync('b', ['--help'], {
      encoding: 'utf-8'
    })
    assert.ok(process.stdout.includes('--help'))
  })

  describe('baldr audacity', function () {
    const tmpDir = createTmpDir()
    const src = path.join(getDirname(import.meta), 'files', 'audacity.txt')
    const dest = path.join(tmpDir, 'audacity.txt')
    fs.copyFileSync(src, dest)

    it('long form: audacity', function () {
      const stdout = exec('audacity', dest)
      assert.ok(stdout.includes('- ref: A1'))
    })

    it('alias: au', function () {
      const stdout = exec('au', dest)
      assert.ok(stdout.includes('- ref: A1'))
    })
  })
})
