import path from 'path'

import { readFile } from '@bldr/core-node'
import { getConfig } from '@bldr/config'

const config = getConfig()

import assert from 'assert'

function readPresentationFile(filePath) {
  return readFile(path.join(config.localRepo, filePath))
}

function parseExample(fileBaseName) {
  return parse(readPresentationFile(`src/vue/apps/lamp/examples/${fileBaseName}.baldr.yml`))
}

function parseMasterExample(masterName) {
  return parse(readPresentationFile(`src/masters/${masterName}/src/example.baldr.yml`))
}

describe('Package “@bldr/presentation-parser”', function () {
  it('simple', async function () {
    const presentation = parseExample('minimal')
    assert.strictEqual(presentation.slides[0].no, 1)
    assert.strictEqual(presentation.slides[1].no, 2)
  })

  it('Property „presentation.meta“', async function () {
    const presentation = parseExample('metaData')
    assert.strictEqual(presentation.meta.ref, 'EP_common_metaData')
    assert.strictEqual(presentation.meta.title, 'Slide meta data')
    assert.strictEqual(presentation.meta.subtitle, 'A subtitle')
    assert.strictEqual(presentation.meta.grade, 7)
    assert.strictEqual(presentation.meta.curriculum, 'Topic 1 / Topic 2')
    assert.strictEqual(presentation.meta.curriculumUrl, 'https://de.wikipedia.org')
  })

  it('Property „slide.meta“', async function () {
    const presentation = parseExample('metaData')
    const slides = presentation.slides
    assert.strictEqual(slides[0].meta.ref, 'slide_first')
    assert.strictEqual(slides[0].meta.title, undefined)
    assert.strictEqual(slides[0].meta.source, undefined)
    assert.strictEqual(slides[0].meta.description, undefined)

    assert.strictEqual(slides[1].meta.title, 'This slide has a <em>title</em>.')

    assert.strictEqual(slides[2].meta.description, 'This slide has a <em>description</em>.')

    assert.strictEqual(slides[3].meta.source, '<a href="http://example.com">http://example.com</a>')

    assert.strictEqual(slides[4].meta.ref, 'all')
    assert.strictEqual(slides[4].meta.title, 'This slide has a title.')
    assert.strictEqual(slides[4].meta.source, 'This slide has a source.')
    assert.strictEqual(slides[4].meta.description, 'This slide has a description.')

    assert.strictEqual(slides[5].meta.title, 'This is <em>starred (italic)</em>.')
    assert.strictEqual(slides[5].meta.source, 'This is <strong>bold</strong>.')
    assert.strictEqual(
      slides[5].meta.description,
      '<h1 id="heading-1">Heading 1</h1>\n' +
      '<ol>\n' +
      '<li>one</li>\n' +
      '<li>two</li>\n' +
      '<li>three</li>\n' +
      '</ol>\n'
    )
  })

  it('Master „generic“', async function () {
    const presentation = parseMasterExample('generic')
    const slides = presentation.slides
    assert.deepStrictEqual(slides[4].props.markup, [
      '<p>step 1</p>\n',
      '\n<p>step 2</p>\n'
    ])
  })

  it('Master „quote“', async function () {
    const presentation = parseMasterExample('quote')
    const slides = presentation.slides
    assert.strictEqual(slides[0].props.text, '<span class="quotation-mark">»</span> Short form quote. <span class="quotation-mark">«</span>')
  })

})
