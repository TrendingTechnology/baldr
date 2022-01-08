/* globals describe it */

import assert from 'assert'

import { transliterate } from '../dist/main'

function assertTransliterate (input, expected) {
  assert.strictEqual(transliterate(input), expected)
}

describe('Supports German umlauts', function () {
  it('Input integer (1)', function () {
    assertTransliterate('ä ö ü Ä Ö Ü ß', 'ae oe ue Ae Oe Ue ss')
  })
})
