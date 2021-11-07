/* globals describe it */

const assert = require('assert')
const path = require('path')
const fs = require('fs')
const childProcess = require('child_process')

describe('Package “@bldr/cli”', function () {
  it('--help', async function () {
    const process = childProcess.spawnSync('baldr', ['--help'], {
      encoding: 'utf-8'
    })
    assert.ok(process.stdout.includes('--help'))
  })
})
