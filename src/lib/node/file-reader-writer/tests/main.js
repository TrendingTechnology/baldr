/* globals describe it */

const file = require('../dist/node/main.js')
const assert = require('assert')

const fs = require('fs')
const os = require('os')
const path = require('path')

const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'bldr-file-reader-writer'))
const tmpFile = path.join(tmpDir, 'test.txt')

describe('Package “@bldr/file-reader-writer”', function () {
  it('Functions “writeFile()” and “readFile()”', function () {
    file.writeFile(tmpFile, 'test')
    const content = file.readFile(tmpFile)
    assert.strictEqual(content, 'test')
  })

  it('Functions “writeJsonFile()” and  “readJsonFile()”', function () {
    file.writeJsonFile(tmpFile, { test: 'test' })
    const content = file.readJsonFile(tmpFile)
    assert.strictEqual(content.test, 'test')
  })

  it('Functions “writeYamlFile()” and  “readYamlFile()”', function () {
    file.writeYamlFile(tmpFile, { camelCase: { snakeCase: 'test' } })
    const txtContent = file.readFile(tmpFile)
    assert.ok(txtContent.indexOf('snake_case') > -1)
    const content = file.readYamlFile(tmpFile)
    assert.strictEqual(content.camelCase.snakeCase, 'test')
  })
})
