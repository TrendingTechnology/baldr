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

describe('Package “@bldr/presentation-parser”', function () {
  it('Function parse()', function () {
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
})
