/* globals describe it */
const assert = require('assert')

const { convertMarkdownToHtml } = require('../dist/node/main.js')

function assertEqual (actual, expected) {
  assert.deepStrictEqual(convertMarkdownToHtml(actual), expected)
}

describe('Package “@bldr/markdown-to-html”', function () {
  it('Arrows', function () {
    assertEqual('test -> test', 'test → test')
  })

  it('Inline HTML', function () {
    assertEqual(
      'test <strong>strong</strong> test',
      'test <strong>strong</strong> test'
    )
  })

  it('Paragraph', function () {
    assertEqual('test\n\ntest', '<p>test</p>\n<p>test</p>\n')
  })

  it('Unordered list', function () {
    assertEqual('# Section\n\n- one\n- two', '<h1 id="section">Section</h1>\n<ul>\n<li>one</li>\n<li>two</li>\n</ul>\n')
  })

  it('Ordered list', function () {
    assertEqual('# Section\n\n1. one\n2. two', '<h1 id="section">Section</h1>\n<ol>\n<li>one</li>\n<li>two</li>\n</ol>\n')
  })

  it('Array', function () {
    assertEqual(
      ['test *emph* test', 'test'],
      ['test <em>emph</em> test', 'test']
    )
  })

  it('Object', function () {
    assertEqual(
      { one: '__one__', two: '__two__' },
      { one: '<strong>one</strong>', two: '<strong>two</strong>' }
    )
  })
})
