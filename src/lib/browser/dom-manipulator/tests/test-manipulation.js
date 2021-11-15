/* globals describe it */

const assert = require('assert')

const { wrapWords } = require('../dist/node/manipulation.js')

describe('manipulation.ts”', function () {
  it('Method select(): <p>test</p>', function () {
    const result = wrapWords('one two three')
    assert.strictEqual(
      result,
      '<span class="word">one</span> <span class="word">two</span> <span class="word">three</span>'
    )
  })
})
