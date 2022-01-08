/* globals describe it */

import assert from 'assert'

import { mimeTypeManager } from '../dist/main'

describe('Class “MimeTypeManager”', function () {
  it('Method “extensionToType()”', function () {
    assert.strictEqual(mimeTypeManager.extensionToType('jpg'), 'image')
  })
})
