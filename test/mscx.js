const { assert } = require('./lib/helper.js')
const mscx = require('../mscx.js')
const rewire = require('rewire')('../mscx.js')

describe('file “mscx.js”', () => {
  describe('function “checkExecutable()”', () => {
    it('function “checkExecutable()”: existing executable', () => {
      let checkExecutable = rewire.__get__('checkExecutable')
      assert.strictEqual(checkExecutable('echo'), true)
    })

    it('function “checkExecutable()”: nonexisting executable', () => {
      let checkExecutable = rewire.__get__('checkExecutable')
      assert.strictEqual(checkExecutable('loooooool'), false)
    })

    it('function “checkExecutables()”: all are existing', () => {
      let { status, unavailable } = mscx
        .checkExecutables(['echo', 'ls'])
      assert.strictEqual(status, true)
      assert.deepStrictEqual(unavailable, [])
    })

    it('function “checkExecutables()”: one executable', () => {
      let { status, unavailable } =
        mscx.checkExecutables(['echo'])
      assert.strictEqual(status, true)
      assert.deepStrictEqual(unavailable, [])
    })

    it('function “checkExecutables()”: one nonexisting executable', () => {
      let { status, unavailable } =
        mscx.checkExecutables(['echo', 'loooooool'])
      assert.strictEqual(status, false)
      assert.deepStrictEqual(unavailable, ['loooooool'])
    })

    it('function “checkExecutables()”: two nonexisting executable', () => {
      let { status, unavailable } =
        mscx.checkExecutables(['troooooool', 'loooooool'])
      assert.strictEqual(status, false)
      assert.deepStrictEqual(unavailable, ['troooooool', 'loooooool'])
    })

    it('function “checkExecutables()”: without arguments', () => {
      let { status, unavailable } = mscx.checkExecutables()
      assert.strictEqual(status, true)
      assert.deepStrictEqual(unavailable, [])
    })
  })

  it('function “gitPull()”', () => {
    assert.ok(!mscx.gitPull('songs'))
  })
})
