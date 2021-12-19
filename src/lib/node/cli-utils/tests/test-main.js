/* globals describe it */

const assert = require('assert')

const { CommandRunner } = require('../dist/node/main.js')

describe('Package “@bldr/cli-utils”', function () {

  describe('Method “exec()”', function () {
    it('success', async function () {
      const cmd = new CommandRunner()
      const result = await cmd.exec(['cat', '/etc/baldr.json'])
      assert.ok(result.stdout.indexOf('baldr') > -1)
    })

    it('error', async function () {
      const cmd = new CommandRunner()
      cmd.exec(['/xxx_vff84c5ad-1cc4-4910-986f-2885c4c91862']).catch((reason) => {
        assert.ok(true, 'throws')
      })
    })
  })

  describe('Method “execSync()”', function () {
    it('success', function () {
      const cmd = new CommandRunner()
      const result = cmd.execSync(['cat', '/etc/baldr.json'])
      assert.ok(result.stdout.indexOf('baldr') > -1)
    })

    it('error', function () {
      const cmd = new CommandRunner()
      assert.throws(() => {
        cmd.execSync(['/xxx_vff84c5ad-1cc4-4910-986f-2885c4c91862'])
      })
    })
  })

})
