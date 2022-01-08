/* globals describe it */

import assert from 'assert'

import { getMaster } from '../dist/main'

describe('Main public exports', function () {
  describe('Function “getMaster()”', function () {
    it('Get a valid master', function () {
      const master = getMaster('audio')
      assert.strictEqual(master.name, 'audio')
    })

    it('Get a invalid master', function () {
      assert.throws(() => {
        getMaster('xxx')
      })
    })
  })
})
