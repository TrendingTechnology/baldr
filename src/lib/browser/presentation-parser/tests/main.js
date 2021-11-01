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
  it('presentation.meta', function () {
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

  it('presentation.slides', function () {
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

  it('no slides', function () {
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

  it('“ref” and “title” not in “meta”', function () {
    const presentation = parseTestPresentation('ref-title-not-in-meta')
    assert.strictEqual(
      presentation.meta.title,
      'Title'
    )
    assert.strictEqual(
      presentation.meta.ref,
      'Reference'
    )
  })
})
