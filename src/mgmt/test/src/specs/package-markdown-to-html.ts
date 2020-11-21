import assert from 'assert'

import { convertMarkdownFromString } from '@bldr/markdown-to-html'

describe('Package “@bldr/markdown-to-html”', function () {
  it('arrows', async function () {
    assert.strictEqual(convertMarkdownFromString('test -> test'), 'quote')
  })

})
