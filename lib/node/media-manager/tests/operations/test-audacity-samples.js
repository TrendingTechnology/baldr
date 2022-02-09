/* globals describe it */
import assert from 'assert'
import path from 'path'
import fs from 'fs'

import { readYamlFile } from '@bldr/file-reader-writer'
import { copyToTmp } from '@bldr/node-utils'

import convertAudacitySamples from '../../dist/operations/audacity-samples.js'

describe('operations/audacity-samples.ts', function () {
  it('audacity -> YAML', function () {
    const filePath = copyToTmp(
      'tests',
      'files',
      'audacity-samples',
      'Textspur.txt'
    )
    convertAudacitySamples(filePath)
    const yamlFile = filePath + '.yml'
    const yaml = readYamlFile(yamlFile)
    assert.ok(fs.existsSync(yamlFile))

    assert.strictEqual(yaml.samples[0].ref, 'Ausschnitt-1')
    assert.strictEqual(yaml.samples[0].title, 'Ausschnitt 1 (00:00-00:31)')
    assert.strictEqual(yaml.samples[0].startTime, 0)
    assert.strictEqual(yaml.samples[0].endTime, 31.868584)

    assert.strictEqual(yaml.samples[1].ref, 'Sample-1')
    assert.strictEqual(yaml.samples[1].title, 'Sample 1 (00:31-04:07)')
    assert.strictEqual(yaml.samples[1].startTime, 31.868584)
    assert.strictEqual(yaml.samples[1].endTime, 247.238531)
  })

  it('YAML -> audacity', function () {})
})
