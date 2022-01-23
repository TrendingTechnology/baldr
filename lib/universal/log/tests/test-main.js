/* globals describe it */

import assert from 'assert'

import sinon from 'sinon'

import * as log from '../dist/main'

log.setLogLevel(5)

describe('Package “@bldr/log”', function () {
  it('all log functions', function () {
    log.error('error')
    log.warn('warn')
    log.info('info')
    log.verbose('verbose')
    log.debug('debug')
  })

  it('log.info(): No replacements', function () {
    log.info('Some string')
  })

  it('log.info(): With replacements', function () {
    const spyInfo = sinon.spy(console, 'info')

    log.info('string (default color): %s; string (colored): %s; float %.1f', [
      'troll',
      log.colorize.red('red'),
      123.456
    ])
    assert(
      spyInfo.calledWith(
        '\u001b[32m█\u001b[39m string (default color): \u001b[32mtroll\u001b[39m; string (colored): \u001b[31mred\u001b[39m; float 123.5'
      )
    )
    spyInfo.restore()
  })

  it('colors', function () {
    const spyInfo = sinon.spy(console, 'info')
    log.info(
      '“%s” “%s” “%s” “%s”',
      ['green', 'yellow', 'red', 'should be red'],
      ['green', 'yellow', 'red']
    )
    console.log(spyInfo.args)

    assert(
      spyInfo.calledWith(
        '\u001b[32m█\u001b[39m “\u001b[32mgreen\u001b[39m” “\u001b[33myellow\u001b[39m” “\u001b[31mred\u001b[39m” “\u001b[31mshould be red\u001b[39m”'
      )
    )
    spyInfo.restore()
  })

  it('colorizeDiff()', function () {
    const diff = log.colorizeDiff('line1\nline2\n', 'line 1\nline2\nline3')
    assert.ok(diff.includes('-line1'))
    assert.ok(diff.includes('+line 1'))
    assert.ok(diff.includes('+line3'))
    assert.ok(!diff.includes('===='))
    assert.ok(!diff.includes('--- old'))
    assert.ok(!diff.includes('+++ new'))
    assert.ok(!diff.includes('No newline at end of file'))
  })
})
