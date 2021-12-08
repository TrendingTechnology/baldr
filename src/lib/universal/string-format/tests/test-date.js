/* globals describe it */

const assert = require('assert')

const {
  convertDurationToSeconds,
  formatDuration,
  getCurrentSchoolYear,
  getFormatedSchoolYear
} = require('../dist/node/main.js')

describe('Function “convertDurationToSeconds()”', function () {
  it('Input integer', function () {
    assert.strictEqual(convertDurationToSeconds(1), 1)
  })

  it('Input string', function () {
    assert.strictEqual(convertDurationToSeconds('1'), 1)
  })

  it('1:01', function () {
    assert.strictEqual(convertDurationToSeconds('1:01'), 61)
  })

  it('01:00', function () {
    assert.strictEqual(convertDurationToSeconds('01:00'), 60)
  })

  it('1:00:00', function () {
    assert.strictEqual(convertDurationToSeconds('1:00:00'), 3600)
  })
})

describe('Function “formatDuration()”', function () {
  it('One second', function () {
    assert.strictEqual(formatDuration(1), '00:00:01')
  })

  it('One second short', function () {
    assert.strictEqual(formatDuration(1, true), '00:01')
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
