/* globals describe it */

import assert from 'assert'

import { parsePresentation } from './_helper'

const presentation = parsePresentation('step/step-support')

function getSlide (ref) {
  return presentation.getSlideByRef(ref)
}

describe('Step support in the slide objects', function () {
  this.beforeAll(async function () {
    await presentation.resolve()
  })

  it('no-step-support', function () {
    const slide = getSlide('no-step-support')
    assert.strictEqual(slide.steps.length, 0)
  })

  it('Hook “collectStepsLate()”: sample-list', function () {
    const slide = getSlide('sample-list')
    assert.strictEqual(slide.steps[0].no, 1)
  })

  it('Hook “collectStepsEarly”: counter', function () {
    const slide = getSlide('counter')
    assert.strictEqual(slide.steps[0].title, 'Zähle „I“')
  })
})
