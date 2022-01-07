/* globals describe it */

const assert = require('assert')

const { generateUuid } = require('../dist/node/main.js')

describe('Function “genUuid()”', function () {
  it('Run genUuid()', function () {
    const uuid = generateUuid()
    assert.deepStrictEqual(typeof uuid, 'string')
    assert.deepStrictEqual(uuid.length, 36)
  })
})
