/* globals describe it */

import assert from 'assert'
import { parsePresentation, parseFirstSlide } from './_helper'

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
    const presentation = parsePresentation('common/audioOverlay')
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

  describe('Getter attribute “title”', function () {
    const presentation = parsePresentation('slide/slide-title')

    function getTitle (ref) {
      const slide = presentation.getSlideByRef(ref)
      return slide.title
    }

    it('from-metadata-title', function () {
      assert.strictEqual(getTitle('from-metadata-title'), 'From metadata')
    })

    it('from-hook', function () {
      assert.strictEqual(getTitle('from-hook'), 'From hook')
    })
  })

  describe('Property “cssStyle”', function () {
    const presentation = parsePresentation('common/style')

    function getCssStyle (ref) {
      const slide = presentation.getSlideByRef(ref)
      return slide.cssStyle
    }

    it('Only CSS styles', function () {
      assert.deepStrictEqual(getCssStyle('css-style-only'), {
        fontSize: '8em'
      })
    })

    it('Using Sass variables', function () {
      assert.deepStrictEqual(getCssStyle('sass-variables'), {
        backgroundColor: '#4e79a7',
        color: '#59a14e'
      })
    })

    it('Appended semicolon', function () {
      assert.deepStrictEqual(getCssStyle('appended-semicolon'), {
        backgroundColor: '#4e79a7',
        color: '#59a14e'
      })
    })

    it('No style', function () {
      assert.strictEqual(getCssStyle('no-style'), undefined)
    })
  })
})
