/* globals describe it */

const assert = require('assert')
const path = require('path')

const { parse } = require('../dist/node/main.js')
const { readFile } = require('@bldr/file-reader-writer')
const config = require('@bldr/config')

function getPresentationContent (relPath) {
  return readFile(
    path.join(
      config.mediaServer.basePath,
      'Musik',
      relPath,
      'Praesentation.baldr.yml'
    )
  )
}

function parsePresentation (relPath) {
  return parse(getPresentationContent(relPath))
}

function parseTestPresentation (fileName) {
  return parse(readFile(path.join(__dirname, 'files', `${fileName}.baldr.yml`)))
}

describe('Package “@bldr/presentation-parser”', function () {
  describe('meta', function () {
    it('Real world example: 12/10_Interpreten/10_Konzertierende-Musiker/20_Konzertwesen', function () {
      const presentation = parsePresentation(
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

  describe('slides', function () {
    it('real world example', function () {
      const presentation = parsePresentation(
        '12/20_Tradition/10_Umgang-Tradition/10_Futurismus'
      )
      const slides = presentation.slides
      assert.strictEqual(slides.flat[0].no, 1)
      assert.strictEqual(slides.flat[0].level, 1)

      assert.strictEqual(slides.flat[0].master.name, 'document')

      // section: Luigi Russolo
      const slide = slides.tree[4]
      assert.strictEqual(slide.no, 5)

      assert.strictEqual(slide.slides[0].master.name, 'task')
      assert.strictEqual(slide.slides[0].level, 2)
      assert.strictEqual(slide.slides[1].master.name, 'scoreSample')
    })

    it('throws error: no slides', function () {
      assert.throws(
        () => {
          parseTestPresentation('no-slides')
        },
        {
          message: 'The property “slides” must not be null.',
          name: 'Error'
        }
      )
    })

    it('Nested slides', function () {
      const presentation = parseTestPresentation('nested-slides')
      const tree = presentation.slides.tree
      assert.strictEqual(tree[0].master.name, 'generic')
      assert.strictEqual(tree[0].slides[0].master.name, 'generic')
      assert.strictEqual(tree[0].slides[0].slides[0].master.name, 'generic')
    })

    it('iterator', function () {
      const presentation = parseTestPresentation('nested-slides')
      for (const slide of presentation.slides) {
        assert.strictEqual(typeof slide.no, 'number')
      }
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
