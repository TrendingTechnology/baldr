/* globals describe it */

const assert = require('assert')

const { parseMasterPresentation } = require('../_helper.js')

const presentation = parseMasterPresentation('audio')

describe('Master audio', function () {
  it('Some fields', async function () {
    await presentation.resolve()
    const fields = presentation.getSlideByNo(1).fields
    assert.strictEqual(fields.title, 'Du bist als Kind zu heiß gebadet worden')
    assert.strictEqual(fields.composer, 'Eduard May')
    assert.strictEqual(fields.artist, 'Paul Godwin')
    assert.strictEqual(
      fields.description,
      '<h1 id="some-text">Some text</h1>\n<ol>\n<li>one</li>\n<li>two</li>\n<li>three</li>\n</ol>\n'
    )
    assert.strictEqual(
      fields.asset.uri.raw,
      'uuid:4f6c6b03-e5d1-4fc8-8bb9-ab3ffea8fb64'
    )
    assert.strictEqual(fields.sample.yaml.ref, 'complete')
  })
})
