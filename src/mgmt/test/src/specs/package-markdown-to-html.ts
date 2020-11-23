import assert from 'assert'

import { convertMarkdownToHtml } from '@bldr/markdown-to-html'

function assertEqual (actual: any, expected: any) {
  assert.deepStrictEqual(convertMarkdownToHtml(actual), expected)
}

describe('Package “@bldr/markdown-to-html”', function () {
  it('arrows', async function () {
    assertEqual('test -> test', 'test → test')
  })

  it('inline HTML', async function () {
    assertEqual('test <strong>strong</strong> test', 'test <strong>strong</strong> test')
  })

  it('Paragraph', async function () {
    assertEqual('test\n\ntest', '<p>test</p>\n<p>test</p>\n')
  })

  it('Array', async function () {
    assertEqual(['test *emph* test', 'test'], ['test <em>emph</em> test', 'test'])
  })

  it('Object', async function () {
    assertEqual(
      { one: '__one__', two: '__two__' },
      { one: '<strong>one</strong>', two: '<strong>two</strong>' }
    )
  })

})
