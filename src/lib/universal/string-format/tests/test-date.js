/* globals describe it */

const assert = require('assert')

const {
  convertDurationToSeconds,
  formatDuration,
  getCurrentSchoolYear,
  getFormatedSchoolYear
} = require('../dist/node/main.js')

describe('Function “convertDurationToSeconds()”', function () {
  it('Input integer (1)', function () {
    assert.strictEqual(convertDurationToSeconds(1), 1)
  })

  it('Input float (1.23)', function () {
    assert.strictEqual(convertDurationToSeconds(1.23), 1.23)
  })

  it('Input float greater than or equal to 60 (61.23)', function () {
    assert.strictEqual(convertDurationToSeconds(61.23), 61.23)
  })

  it('Input integer as string (\'1\')', function () {
    assert.strictEqual(convertDurationToSeconds('1'), 1)
  })

  it('Input float as string (\'1.23\')', function () {
    assert.strictEqual(convertDurationToSeconds('1.23'), 1.23)
  })

  it('Minutes (1:01)', function () {
    assert.strictEqual(convertDurationToSeconds('1:01'), 61)
  })

  it('Minutes with leading zero (01:00)', function () {
    assert.strictEqual(convertDurationToSeconds('01:00'), 60)
  })

  it('Hours (1:00:00)', function () {
    assert.strictEqual(convertDurationToSeconds('1:00:00'), 3600)
  })

  it('Hours with leading zero (01:00:00)', function () {
    assert.strictEqual(convertDurationToSeconds('01:00:00'), 3600)
  })

  it('Hours with float seconds (01:00:00.23)', function () {
    assert.strictEqual(convertDurationToSeconds('01:00:00.23'), 3600.23)
  })

  it('Invalid seconds (01:00:61)', function () {
    assert.throws(
      () => {
        convertDurationToSeconds('01:00:61')
      },
      {
        message: 'Invalid duration string “01:00:61”: The number of seconds must be less than 60!',
        name: 'Error'
      }
    )
  })

  it('Invalid minutes (1:60:00)', function () {
    assert.throws(
      () => {
        convertDurationToSeconds('1:60:00')
      },
      {
        message: 'Invalid duration string “1:60:00”: The number of minutes must be less than 60!',
        name: 'Error'
      }
    )
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
