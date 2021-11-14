/* globals describe it */

const assert = require('assert')

const { ElementSelector } = require('../dist/node/selector.js')

describe('Class “ElementSelector()”', function () {
  it('Method select(): <p>test</p>', function () {
    const selector = new ElementSelector('<p>test</p>', 'p')
    const steps = selector.select()
    assert.strictEqual(steps[0].htmlElement.constructor.name, 'HTMLParagraphElement')
  })

  it('Method count(): <p>test</p>', function () {
    const selector = new ElementSelector('<p>test</p>', 'p')
    assert.strictEqual(selector.count(), 2)
  })
})
