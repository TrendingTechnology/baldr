import assert from 'assert'

import { convertMarkdownFromString } from '@bldr/markdown-to-html'

describe('Package “@bldr/markdown-to-html”', function () {
  it('arrows', async function () {
    assert.strictEqual(convertMarkdownFromString('test -> test'), 'test → test')
  })

  it('inline HTML', async function () {
    assert.strictEqual(convertMarkdownFromString('test <strong>strong</strong> test'), 'test <strong>strong</strong> test')
  })

})
