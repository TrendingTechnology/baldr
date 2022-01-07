/* globals describe it */

const assert = require('assert')

const {
  wrapWords,
  splitHtmlIntoChunks
} = require('../dist/node/manipulation.js')

describe('manipulation.ts”', function () {
  describe('Function “wrapWords()”', function () {
    it('one two three', function () {
      const result = wrapWords('one two three')
      assert.strictEqual(
        result,
        '<span class="word">one</span> ' +
          '<span class="word">two</span> ' +
          '<span class="word">three</span>'
      )
    })

    it('h1 ul li', function () {
      const result = wrapWords(
        '<h1>heading</h1><ul><li>one</li><li>two</li><li>three</li></ul>'
      )
      assert.strictEqual(
        result,
        '<h1><span class="word">heading</span></h1>' +
          '<ul><li><span class="word">one</span></li>' +
          '<li><span class="word">two</span></li>' +
          '<li><span class="word">three</span></li></ul>'
      )
    })
  })

  describe('Function “splitHtmlIntoChunks()”', function () {
    it('Short string', function () {
      assert.deepStrictEqual(splitHtmlIntoChunks('test'), ['<p>test</p>'])
    })

    it('Split', function () {
      assert.deepStrictEqual(
        splitHtmlIntoChunks('<p>Lorem ipsum dolor</p><p>sit tandem.</p>', 10),
        ['<p>Lorem ipsum dolor</p>', '<p>sit tandem.</p>']
      )
    })

    it('To short to split', function () {
      assert.deepStrictEqual(
        splitHtmlIntoChunks('<p>Lorem ipsum dolor</p><p>sit tandem.</p>', 100),
        ['<p>Lorem ipsum dolor</p><p>sit tandem.</p>']
      )
    })
  })
})
