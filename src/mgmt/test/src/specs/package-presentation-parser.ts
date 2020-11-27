import path from 'path'

import { parse } from '@bldr/presentation-parser'
import { readFile } from '@bldr/core-node'
import config from '@bldr/config'
import { PresentationTypes } from '@bldr/type-definitions'

import assert from 'assert'

function readPresentationFile(filePath: string): string {
  return readFile(path.join(config.localRepo, filePath))
}

function parseExample(fileBaseName: string): PresentationTypes.Presentation {
  return parse(readPresentationFile(`src/vue/apps/lamp/examples/${fileBaseName}.baldr.yml`))
}

describe('Package “@bldr/presentation-parser”', function () {
  it('simple', async function () {
    const presentation = parseExample('minimal')
    assert.strictEqual(presentation.slides[0].no, 1)
    assert.strictEqual(presentation.slides[1].no, 2)
  })

  it('Property „meta“', async function () {
    const presentation = parseExample('metaData')
    assert.strictEqual(presentation.meta.id, 'EP_common_metaData')
    assert.strictEqual(presentation.meta.title, 'Slide meta data')
    assert.strictEqual(presentation.meta.subtitle, 'A subtitle')
    assert.strictEqual(presentation.meta.grade, 7)
    assert.strictEqual(presentation.meta.curriculum, 'Topic 1 / Topic 2')
    assert.strictEqual(presentation.meta.curriculumUrl, 'https://de.wikipedia.org')
  })
})
