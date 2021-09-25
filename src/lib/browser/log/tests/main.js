/* globals describe it */
const assert = require('assert')

const { detectFormatTemplate } = require('../dist/node/format')

const log = require('../dist/node/main')

log.setLogLevel(4)

describe('Package “@bldr/log”', function () {
  it('log.info()', function () {
    log.info('Some string')

    log.info(
      'Test: string (default color) %s string (colored) %s decimal %d float %.1f',
      'troll',
      log.colorize.red('red'),
      123.456,
      123.456
    )
  })

  it('detectFormatTemplate()', function () {
    assert.deepStrictEqual(
      detectFormatTemplate(['%s', 'test'], log.colorize.blue),
      ['test']
    )

    const result = detectFormatTemplate(
      ['hello, %s', 'world'],
      log.colorize.blue
    )
    assert.ok(result[0].includes('world'))
  })

  it('colorizeDiff()', function () {
    const diff = log.colorizeDiff('line1\nline2\n', 'line 1\nline2\nline3')
    assert.ok(diff.includes('-line1'))
    assert.ok(diff.includes('+line 1'))
    assert.ok(diff.includes('+line3'))
  })
})
