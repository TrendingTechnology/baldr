
const assert = require('assert')

const { convertDurationToSeconds } = require('../dist/node/main.js')

const convert = convertDurationToSeconds

describe('Function “convertDurationToSeconds()”', function () {
  it('Input integer', function () {
    assert.deepStrictEqual(convert(1), 1)
  })

  it('Input string', function () {
    assert.deepStrictEqual(convert('1'), 1)
  })

  it('1:01', function () {
    assert.deepStrictEqual(convert('1:01'), 61)
  })

  it('01:00', function () {
    assert.deepStrictEqual(convert('01:00'), 60)
  })

  it('1:00:00', function () {
    assert.deepStrictEqual(convert('1:00:00'), 3600)
  })
})
