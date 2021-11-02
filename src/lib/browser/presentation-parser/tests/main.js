/* globals describe it */

const assert = require('assert')

const {
  parseRealWorldPresentation,
  parseTestPresentation
} = require('./_helper.js')

describe('Package “@bldr/presentation-parser”', function () {
  describe('meta', function () {
    it('Real world example: 12/10_Interpreten/10_Konzertierende-Musiker/20_Konzertwesen', function () {
      const presentation = parseRealWorldPresentation(
        '12/10_Interpreten/10_Konzertierende-Musiker/20_Konzertwesen'
      )

      assert.strictEqual(presentation.meta.ref, 'Konzertwesen')
      assert.strictEqual(
        presentation.meta.uuid,
        '35f5146c-3c98-4493-b9b9-534eba361e12'
      )
      assert.strictEqual(
        presentation.meta.title,
        'Die Entwicklung des Konzertwesens'
      )
      assert.strictEqual(presentation.meta.subject, 'Musik')
      assert.strictEqual(
        presentation.meta.title,
        'Die Entwicklung des Konzertwesens'
      )
      assert.strictEqual(
        presentation.meta.curriculum,
        'Interpreten und Interpretationen / Konzertierende Musiker'
      )
      assert.strictEqual(presentation.meta.grade, 12)
    })

    it('“ref” and “title” not in “meta”', function () {
      const presentation = parseTestPresentation('ref-title-not-in-meta')
      assert.strictEqual(presentation.meta.title, 'Title')
      assert.strictEqual(presentation.meta.ref, 'Reference')
    })
  })

  it('Unknown property in the presentation root', function () {
    assert.throws(
      () => {
        parseTestPresentation('unknown-property')
      },
      {
        message: 'Unknown properties in raw object: {"unknown":"test"}',
        name: 'Error'
      }
    )
  })

  it('Irresolvable required asset', async function () {
    const presentation = parseTestPresentation('media-assets-irresolvable')

    await assert.rejects(
      async () => {
        await presentation.resolve()
      },
      err => {
        assert.strictEqual(err.name, 'Error')
        assert.strictEqual(
          err.message,
          'Media with the ref ”xxxxxxx” couldn’t be resolved.'
        )
        return true
      }
    )
  })

  it('Irresolvable optional asset', async function () {
    const presentation = parseTestPresentation(
      'media-assets-irresolvable-optional'
    )
    const assets = await presentation.resolve()
    assert.strictEqual(assets.length, 0)
  })

  describe('Media URI reference abbreviation', function () {
    it('ok', function () {
      const presentation = parseTestPresentation('ref-abbreviation-ok')
      const rawString = presentation.rawYamlStringExpanded
      assert.ok(rawString != null)
      assert.ok(rawString.includes('ref:ref-abbreviation_file-1'))
      assert.ok(rawString.includes('ref:ref-abbreviation_file-2'))
    })

    it('error', function () {
      assert.throws(
        () => {
          parseTestPresentation('ref-abbreviation-error')
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
