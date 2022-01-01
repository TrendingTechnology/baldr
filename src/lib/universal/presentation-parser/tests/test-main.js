/* globals describe it */

const assert = require('assert')

const main = require('../dist/node/main.js')

describe('Main public exports', function () {
  describe('Function “getMaster()”', function () {
    it('Get a valid master', function () {
      const master = main.getMaster('audio')
      assert.strictEqual(master.name, 'audio')
    })

    it('Get a invalid master', function () {
      assert.throws(() => {
        main.getMaster('xxx')
      })
    })
  })
})
