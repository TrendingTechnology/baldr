/* globals describe it */

const assert = require('assert')

const { convertHtmlToPlainText, shortenText } = require('../dist/node/main.js')

describe('Function “convertHtmlToPlainText()”', function () {
  it('<h1>', function () {
    assert.deepStrictEqual(
      convertHtmlToPlainText('<h1>section</h1>'),
      'section'
    )
  })

  it('Empty string', function () {
    assert.deepStrictEqual(convertHtmlToPlainText(''), '')
  })

  it('White spaces', function () {
    assert.deepStrictEqual(convertHtmlToPlainText(' one   two '), 'one two')
  })
})

describe('Function “shortenText()”', function () {
  it('<h1>', function () {
    assert.deepStrictEqual(
      shortenText('one two three four five', { maxLength: 10 }),
      'one two …'
    )
  })

  it('Empty string', function () {
    assert.deepStrictEqual(shortenText(''), '')
  })
})
