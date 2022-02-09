/* globals describe it */
import assert from 'assert'
import fs from 'fs'

import { readFile, readYamlFile } from '@bldr/file-reader-writer'
import { copyToTmp } from '@bldr/node-utils'

import convertAudacitySamples from '../../dist/operations/audacity-samples.js'

function copy (fileName) {
  return copyToTmp('tests', 'files', 'audacity-samples', fileName)
}

function convert (fileName) {
  const filePath = copy(fileName)
  convertAudacitySamples(filePath)
  return filePath
}

describe('operations/audacity-samples.ts', function () {
  it('audacity -> YAML', function () {
    const filePath = convert('Textspur.txt')
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

  it('YAML -> audacity', function () {
    const filePath = convert('Bolero.mp3.yml')
    const audacityTxt = filePath + '_audacity.txt'
    assert.ok(fs.existsSync(audacityTxt))
    const content = readFile(audacityTxt)
    assert.ok(content.includes('14.534439\t58.014301\t1'))
  })
})
