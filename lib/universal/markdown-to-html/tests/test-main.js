/* globals describe it */

import assert from 'assert'

import {
  convertNestedMarkdownToHtml,
  convertMarkdownToHtml
} from '../dist/main'

describe('Package “@bldr/markdown-to-html”', function () {
  describe('Function “convertNestedMarkdownToHtml()”', function () {
    function assertNested (actual, expected) {
      assert.deepStrictEqual(convertNestedMarkdownToHtml(actual), expected)
    }

    it('Arrows', function () {
      assertNested('test -> test', 'test → test')
    })

    it('Inline HTML', function () {
      assertNested(
        'test <strong>strong</strong> test',
        'test <strong>strong</strong> test'
      )
    })

    it('Paragraph', function () {
      assertNested('test\n\ntest', '<p>test</p>\n<p>test</p>\n')
    })

    it('Unordered list', function () {
      assertNested(
        '# Section\n\n- one\n- two',
        '<h1 id="section">Section</h1>\n<ul>\n<li>one</li>\n<li>two</li>\n</ul>\n'
      )
    })

    it('Ordered list', function () {
      assertNested(
        '# Section\n\n1. one\n2. two',
        '<h1 id="section">Section</h1>\n<ol>\n<li>one</li>\n<li>two</li>\n</ol>\n'
      )
    })

    it('Array', function () {
      assertNested(
        ['test *emph* test', 'test'],
        ['test <em>emph</em> test', 'test']
      )
    })

    it('Object', function () {
      assertNested(
        { one: '__one__', two: '__two__' },
        { one: '<strong>one</strong>', two: '<strong>two</strong>' }
      )
    })
  })

  describe('Function “convertMarkdownToHtml()”', function () {
    function assertString (actual, expected) {
      assert.strictEqual(convertMarkdownToHtml(actual), expected)
    }

    it('Link', function () {
      assertString(
        '[link](http://example.com)',
        '<a href="http://example.com">link</a>'
      )
    })
  })
})
