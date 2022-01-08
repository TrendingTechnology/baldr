/* globals describe it */

import assert from 'assert'

import { generateUuid } from '../dist/main'

describe('Function “genUuid()”', function () {
  it('Run genUuid()', function () {
    const uuid = generateUuid()
    assert.deepStrictEqual(typeof uuid, 'string')
    assert.deepStrictEqual(uuid.length, 36)
  })
})
