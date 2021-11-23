/* globals describe it */

const assert = require('assert')

const { parsePresentation } = require('../_helper.js')

const presentation = parsePresentation('masters/interactive-graphic')

describe('Master slide “interactive-graphic”', function () {
  describe('Modes', function () {
    it('mode: layer', function () {
      const slide = presentation.getSlideByNo(6)
      assert.strictEqual(slide.fields.mode, 'layer')
    })

    it('mode: layer+', function () {
      const slide = presentation.getSlideByNo(7)
      assert.strictEqual(slide.fields.mode, 'layer+')
    })

    it('mode: group', function () {
      const slide = presentation.getSlideByNo(8)
      assert.strictEqual(slide.fields.mode, 'group')
    })
  })
})
