/* globals describe it */

import assert from 'assert'

import { asciify, deasciify, referencify } from '../dist/main'

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
