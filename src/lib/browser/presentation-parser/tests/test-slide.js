/* globals describe it */

const assert = require('assert')
const { parsePresentation, parseFirstSlide } = require('./_helper.js')

describe('Class “Slide()”', function () {
  it('Basic attributes', function () {
    const presentation = parsePresentation('slide/meta')
    const slide = presentation.slides.flat[0]
    assert.strictEqual(slide.level, 1)
    assert.strictEqual(slide.no, 1)
  })

  it('Metadata', function () {
    const presentation = parsePresentation('slide/meta')
    const slide = presentation.slides.flat[0]
    assert.strictEqual(slide.meta.ref, 'Reference')
    assert.strictEqual(slide.meta.title, 'Title')
    assert.strictEqual(slide.meta.description, 'Description')
    assert.strictEqual(slide.meta.source, 'Source')
  })

  it('attribute “mediaUris” and “optionalMediaUris”', function () {
    const presentation = parsePresentation('slide/media-uris')

    let slide = presentation.getSlideByNo(1)
    assert.deepStrictEqual(slide.mediaUris, new Set(['ref:test']))

    slide = presentation.getSlideByNo(2)
    assert.deepStrictEqual(
      slide.optionalMediaUris,
      new Set(['ref:YT_jNQXAC9IVRw'])
    )
  })

  it('Slide state absent', function () {
    const presentation = parsePresentation('slide/state-absent')
    assert.strictEqual(presentation.slides.numberOfSlides, 1)
    const slide = presentation.slides.flat[0]
    assert.strictEqual(slide.meta.title, 'Present')
  })

  it('throws error: Unknown master', function () {
    assert.throws(
      () => {
        parsePresentation('unknown-master')
      },
      {
        message: 'No master slide found: {"unknownMaster":"test"}',
        name: 'Error'
      }
    )
  })

  it('attribute “audioOverlay”', async function () {
    const presentation = parsePresentation('audio-overlay')
    const assets = await presentation.resolve()
    assert.strictEqual(assets.length, 11)
    for (const asset of assets) {
      assert.ok(typeof asset.ref === 'string')
    }
  })

  describe('Fields', function () {
    it('Unknown field', function () {
      assert.throws(
        () => {
          parsePresentation('fields/unknown-field')
        },
        {
          message: 'The master slide “generic” has no field named “xxx”.',
          name: 'Error'
        }
      )
    })

    it('Attribute “markup”', function () {
      const slide = parseFirstSlide('fields/markup')
      assert.strictEqual(slide.fields.title, 'This is <em>markdown</em>')
    })

    it('Attribute “default”', function () {
      const slide = parseFirstSlide('fields/default')
      assert.strictEqual(slide.fields.autoplay, false)
    })

    it('Attribute “required”', function () {
      assert.throws(
        () => {
          parseFirstSlide('fields/required')
        },
        {
          message:
            'A field named “src” is mandatory for the master slide “audio”.',
          name: 'Error'
        }
      )
    })

    it('Attribute “type”', function () {
      const slide = parseFirstSlide('fields/type')
      assert.strictEqual(slide.fields.title, '1')
    })
  })
})
