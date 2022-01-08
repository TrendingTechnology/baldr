/* globals describe it */

const assert = require('assert')

const { asciify, deasciify, referencify } = require('../dist/main.js')

describe('Function “asciify()”', function () {
  it('Input integer (1)', function () {
    assert.strictEqual(asciify(1), '1')
  })

  it('German Umlaute', function () {
    assert.strictEqual(asciify('äöüß'), 'aeoeuess')
  })
})

describe('Function “deasciify()”', function () {
  it('Input integer (1)', function () {
    assert.strictEqual(deasciify(1), '1')
  })

  it('German Umlaute', function () {
    assert.strictEqual(deasciify('aeoeueAeOeUe'), 'äöüÄÖÜ')
  })
})

describe('Function “referencify()”', function () {
  it('Input integer (1)', function () {
    assert.strictEqual(referencify(1), '1')
  })
})
