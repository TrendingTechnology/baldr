/* globals describe it */

const assert = require('assert')

const {
  parseRealWorldPresentation,
  parsePresentation
} = require('./_helper.js')

describe('File “presentation.ts”', function () {
  describe('meta', function () {
    describe('Real world example: 12/10_Interpreten/10_Konzertierende-Musiker/20_Konzertwesen', function () {
      const presentation = parseRealWorldPresentation(
        '12/10_Interpreten/10_Konzertierende-Musiker/20_Konzertwesen'
      )

      it('presentation.meta.ref', function () {
        assert.strictEqual(presentation.meta.ref, 'Konzertwesen')
      })

      it('presentation.meta.uuid', function () {
        assert.strictEqual(
          presentation.meta.uuid,
          '35f5146c-3c98-4493-b9b9-534eba361e12'
        )
      })

      it('presentation.meta.title', function () {
        assert.strictEqual(
          presentation.meta.title,
          'Die Entwicklung des Konzertwesens'
        )
      })

      it('presentation.meta.subject', function () {
        assert.strictEqual(presentation.meta.subject, 'Musik')
      })

      it('presentation.meta.title', function () {
        assert.strictEqual(
          presentation.meta.title,
          'Die Entwicklung des Konzertwesens'
        )
      })

      it('presentation.meta.grade', function () {
        assert.strictEqual(presentation.meta.grade, 12)
      })

      it('presentation.meta.curriculum', function () {
        assert.strictEqual(
          presentation.meta.curriculum,
          'Interpreten und Interpretationen / Konzertierende Musiker'
        )
      })

      it('presentation.meta.path', function () {
        assert.strictEqual(
          presentation.meta.path,
          'Musik/12/10_Interpreten/10_Konzertierende-Musiker/20_Konzertwesen/Praesentation.baldr.yml'
        )
      })
    })

    it('“ref” and “title” not in “meta”', function () {
      const presentation = parsePresentation(
        'presentation/ref-title-not-in-meta'
      )
      assert.strictEqual(presentation.meta.title, 'Title')
      assert.strictEqual(presentation.meta.ref, 'Reference')
    })
  })

  it('Getter method “parentDir”', function () {
    const presentation = parseRealWorldPresentation(
      '12/10_Interpreten/10_Konzertierende-Musiker/20_Konzertwesen'
    )
    assert.strictEqual(
      presentation.parentDir,
      'Musik/12/10_Interpreten/10_Konzertierende-Musiker/20_Konzertwesen'
    )
  })

  it('Unknown property in the presentation root', function () {
    assert.throws(
      () => {
        parsePresentation('unknown-property')
      },
      {
        message: 'Unknown properties in raw object: {"unknown":"test"}',
        name: 'Error'
      }
    )
  })

  it('Irresolvable required asset', async function () {
    const presentation = parsePresentation('media-assets-irresolvable')

    await assert.rejects(
      async () => {
        await presentation.resolve()
      },
      err => {
        assert.strictEqual(err.name, 'Error')
        assert.strictEqual(
          err.message,
          'The media with the ref ”xxxxxxx” couldn’t be resolved.'
        )
        return true
      }
    )
  })

  it('Irresolvable optional asset', async function () {
    const presentation = parsePresentation('media-assets-irresolvable-optional')
    const assets = await presentation.resolve()
    assert.strictEqual(assets.length, 0)
  })

  it('Presentation: getSlideByRef()', async function () {
    const presentation = parsePresentation('presentation/get-slide-by-ref')
    const slide = presentation.getSlideByRef('one')
    assert.strictEqual(slide.meta.ref, 'one')
  })

  describe('Media URI reference abbreviation', function () {
    it('ok', function () {
      const presentation = parsePresentation('presentation/ref-abbreviation-ok')
      const rawString = presentation.rawYamlStringExpanded
      assert.ok(rawString != null)
      assert.ok(rawString.includes('ref:ref-abbreviation-ok_file-1'))
      assert.ok(rawString.includes('ref:ref-abbreviation-ok_file-2'))
    })

    it('error', function () {
      assert.throws(
        () => {
          parsePresentation('presentation/ref-abbreviation-error')
        },
        {
          message:
            'A reference abbreviation was found, but the presentation has no reference meta information.',
          name: 'Error'
        }
      )
    })
  })
})
