/* globals describe it */

const assert = require('assert')

const {
  convertDurationToSeconds,
  getCurrentSchoolYear,
  getFormatedSchoolYear
} = require('../dist/node/main.js')

describe('Function “convertDurationToSeconds()”', function () {
  it('Input integer', function () {
    assert.deepStrictEqual(convertDurationToSeconds(1), 1)
  })

  it('Input string', function () {
    assert.deepStrictEqual(convertDurationToSeconds('1'), 1)
  })

  it('1:01', function () {
    assert.deepStrictEqual(convertDurationToSeconds('1:01'), 61)
  })

  it('01:00', function () {
    assert.deepStrictEqual(convertDurationToSeconds('01:00'), 60)
  })

  it('1:00:00', function () {
    assert.deepStrictEqual(convertDurationToSeconds('1:00:00'), 3600)
  })
})

it('Function “getCurrentSchoolYear()”', function () {
  const schoolYear = getCurrentSchoolYear()
  const currentYear = new Date().getFullYear()
  assert.ok(schoolYear === currentYear || schoolYear === currentYear - 1)
})

it('Function „getFormatedSchoolYear()”', function () {
  const schoolYear = getFormatedSchoolYear()
  assert.strictEqual(schoolYear.length, 7)
})
