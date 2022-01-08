/* globals describe it */

import assert from 'assert'

import { getExtension, formatMultiPartAssetFileName } from '../dist/main'

describe('Function “getExtension()”', function () {
  it('File name with an extension', function () {
    assert.strictEqual(getExtension('test.mp3'), 'mp3')
  })

  it('File path with an extension', function () {
    assert.strictEqual(getExtension('/data/test.mp3'), 'mp3')
  })

  it('Upper case extension', function () {
    assert.strictEqual(getExtension('test.MP3'), 'mp3')
  })

  it('Throws exception by a file name without an extension', function () {
    assert.throws(
      () => {
        getExtension('test')
      },
      {
        message: 'The given file path “test” has no file extension!',
        name: 'Error'
      }
    )
  })
})

describe('Function “formatMultiPartAssetFileName()”', function () {
  it('No file name change (no = 1)', function () {
    assert.strictEqual(formatMultiPartAssetFileName('test.png', 1), 'test.png')
  })

  it('Change file name (no = 2)', function () {
    assert.strictEqual(
      formatMultiPartAssetFileName('test.png', 2),
      'test_no002.png'
    )
  })

  it('Throws exception if no is no integer (no > 1.23)', function () {
    assert.throws(
      () => {
        formatMultiPartAssetFileName('test.png', 1.23)
      },
      {
        message:
          'test.png: The argument “no” has to be an integer, not “1.23”!',
        name: 'Error'
      }
    )
  })

  it('Throws exception by large no (no > 999)', function () {
    assert.throws(
      () => {
        formatMultiPartAssetFileName('test.png', 1000)
      },
      {
        message:
          'test.png: The multipart asset number must not be greater than 999, got the number “1000”!',
        name: 'Error'
      }
    )
  })

  it('Throws exception by a file name without an extension', function () {
    assert.throws(
      () => {
        formatMultiPartAssetFileName('test', 3)
      },
      {
        message:
          'test: The multipart asset file name must contain a file extension.',
        name: 'Error'
      }
    )
  })
})
