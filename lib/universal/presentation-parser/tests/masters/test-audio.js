/* globals describe it */

import assert from 'assert'

import { parsePresentation } from '../_helper'

const presentation = parsePresentation('masters/audio')

function getSlide (ref) {
  return presentation.getSlideByRef(ref)
}

function getFields (ref) {
  const slide = getSlide(ref)
  return slide.fields
}

describe('Master slide “audio”', function () {
  this.beforeAll(async function () {
    await presentation.resolve()
  })

  it('Some fields', async function () {
    const fields = getFields('description')
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
    assert.strictEqual(fields.sample.meta.ref, 'complete')
  })

  it('short-form', async function () {
    const fields = getFields('short-form')
    assert.strictEqual(fields.src, 'uuid:96626fdb-4ece-47a5-9870-d89356e0f439')
  })
})
