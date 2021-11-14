/* globals describe it */
const assert = require('assert')

const { DOMParserU } = require('../dist/node/node-main.js')

describe('Package “@bldr/universal-dom”', function () {
  it('DOMParserU', function () {
    const dom = new DOMParserU().parseFromString('<p>test</p>', 'text/html')
    const p = dom.querySelector('p')
    assert.strictEqual(p.textContent, 'test')
  })
})
