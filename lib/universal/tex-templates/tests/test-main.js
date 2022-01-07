/* globals it */

const assert = require('assert')

const tex = require('../dist/node/main.js')

it('keyValues', function () {
  assert.strictEqual(tex.keyValues({ test: 'Test' }), '  test = Test,')
  assert.strictEqual(tex.keyValues({ test: 'Test1, Test2' }), '  test = { Test1, Test2 },')
})

it('environment', function () {
  assert.strictEqual(
    tex.environment('test', 'Lorem ipsum', { key1: 'Test 1, 2', key2: 'Test 2' }),
    '\\begin{test}[\n  key1 = { Test 1, 2 },\n  key2 = Test 2,\n]\nLorem ipsum\n\\end{test}'
  )
})
