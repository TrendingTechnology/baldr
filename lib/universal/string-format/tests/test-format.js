/* globals describe it */

import assert from 'assert'

import {
  convertHtmlToPlainText,
  shortenText,
  capitalize
} from '../dist/main'

describe('File “format.ts”', function () {
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

    it('Line breaks', function () {
      assert.deepStrictEqual(convertHtmlToPlainText('one\ntwo'), 'one\ntwo')
    })
  })

  describe('Function “shortenText()”', function () {
    it('Line breaks', function () {
      assert.deepStrictEqual(shortenText('one\ntwo'), 'one two')
    })

    it('Empty string', function () {
      assert.deepStrictEqual(shortenText(''), '')
    })

    it('options: maxLength', function () {
      assert.deepStrictEqual(
        shortenText('one two three four five', { maxLength: 10 }),
        'one two …'
      )
    })

    it('options: stripTags', function () {
      assert.deepStrictEqual(
        shortenText('<h1>section</h1>'),
        '<h1>section</h1>'
      )
      assert.deepStrictEqual(
        shortenText('<h1>section</h1>', { stripTags: true }),
        'section'
      )
    })
  })

  it('Function “capitalize()”', function () {
    assert.deepStrictEqual(capitalize('capitalize'), 'Capitalize')
  })
})
