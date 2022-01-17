/* globals it */

import assert from 'assert'

import { getCurrentSchoolYear, getFormatedSchoolYear } from '../dist/main'

it('Function “getCurrentSchoolYear()”', function () {
  const schoolYear = getCurrentSchoolYear()
  const currentYear = new Date().getFullYear()
  assert.ok(schoolYear === currentYear || schoolYear === currentYear - 1)
})

it('Function „getFormatedSchoolYear()”', function () {
  const schoolYear = getFormatedSchoolYear()
  assert.strictEqual(schoolYear.length, 7)
})
