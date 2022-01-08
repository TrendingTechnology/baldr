/* globals describe it */

import assert from 'assert'

import { parsePresentation } from '../_helper'

const presentation = parsePresentation('masters/interactiveGraphic')

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
