/* globals describe it */

const assert = require('assert')

const { ElementSelector, StepController } = require('../dist/node/main.js')

function instantiateStepController (subset) {
  const selector = new ElementSelector(
    '<p>one</p>' +
      '<p>two</p>' +
      '<p>three</p>' +
      '<p>four</p>' +
      '<p>five</p>',
    'p'
  )
  const steps = selector.select()
  return new StepController(steps, subset)
}

describe('Class “StepController()”', function () {
  it('Step count', function () {
    const controller = instantiateStepController()
    for (const step of controller.steps) {
      assert.strictEqual(step.isVisible, true)
      assert.strictEqual(step.htmlElement.style.visibility, '')
    }
  })

  it('Step count', function () {
    const controller = instantiateStepController()
    assert.strictEqual(controller.stepCount, 6)
  })

  it('Method hideAll()', function () {
    const controller = instantiateStepController()
    controller.hideAll()
    for (const step of controller.steps) {
      assert.strictEqual(step.isVisible, false)
      assert.strictEqual(step.htmlElement.style.visibility, 'hidden')
    }
  })

  it('Method hideAll()', function () {
    const controller = instantiateStepController()
    controller.hideAll()
    for (const step of controller.steps) {
      assert.strictEqual(step.isVisible, false)
      assert.strictEqual(step.htmlElement.style.visibility, 'hidden')
    }
  })

  it('Method showUpTo()', function () {
    const controller = instantiateStepController()
    let step = controller.showUpTo(1)
    assert.strictEqual(step, undefined)
    step = controller.showUpTo(2)
    assert.strictEqual(step.text, 'one')
    step = controller.showUpTo(6)
    assert.strictEqual(step.text, 'five')
  })

  it('Subset: 3-5', function () {
    const controller = instantiateStepController('3-5')
    assert.deepStrictEqual(controller.subsetIndexes, [1, 2, 3])
  })
})
