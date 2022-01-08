/* globals describe it */

import assert from 'assert'
import childProcess from 'child_process'

describe('Package “@bldr/cli”', function () {
  it('--help', async function () {
    const process = childProcess.spawnSync('baldr', ['--help'], {
      encoding: 'utf-8'
    })
    assert.ok(process.stdout.includes('--help'))
  })
})
