/* globals describe it */
const assert = require('assert')

const { convertMarkdownToHtml } = require('../dist/node/main.js')

function assertEqual (actual, expected) {
  assert.deepStrictEqual(convertMarkdownToHtml(actual), expected)
}

describe('Package “@bldr/markdown-to-html”', function () {
  it('arrows', function () {
    assertEqual('test -> test', 'test → test')
  })

  it('inline HTML', function () {
    assertEqual('test <strong>strong</strong> test', 'test <strong>strong</strong> test')
  })

  it('Paragraph', function () {
    assertEqual('test\n\ntest', '<p>test</p>\n<p>test</p>\n')
  })

  it('Array', function () {
    assertEqual(['test *emph* test', 'test'], ['test <em>emph</em> test', 'test'])
  })

  it('Object', function () {
    assertEqual(
      { one: '__one__', two: '__two__' },
      { one: '<strong>one</strong>', two: '<strong>two</strong>' }
    )
  })
})
