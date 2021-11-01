/* globals describe it */
const assert = require('assert')

const sinon = require('sinon')

const log = require('../dist/node/main')

log.setLogLevel(4)

describe('Package “@bldr/log”', function () {
  it('log.info(): No replacements', function () {
    log.info('Some string')
  })

  it('log.info(): With replacements', function () {
    log.info(
      'Test: string (default color) %s string (colored) %s decimal %d float %.1f',
      ['troll', log.colorize.red('red'), 123.456, 123.456]
    )
  })

  it('colors', function () {
    const spyInfo = sinon.spy(console, 'info')
    log.info(
      '“%s” “%s” “%s” “%s”',
      ['green', 'yellow', 'red', 'should be red'],
      ['green', 'yellow', 'red']
    )
    assert(
      spyInfo.calledWith(
        '“\u001b[32mgreen\u001b[39m” “\u001b[33myellow\u001b[39m” “\u001b[31mred\u001b[39m” “\u001b[31mshould be red\u001b[39m”'
      )
    )
    spyInfo.restore()
  })

  it('colorizeDiff()', function () {
    const diff = log.colorizeDiff('line1\nline2\n', 'line 1\nline2\nline3')
    assert.ok(diff.includes('-line1'))
    assert.ok(diff.includes('+line 1'))
    assert.ok(diff.includes('+line3'))
  })
})
