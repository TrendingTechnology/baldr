import { embedSvgInline } from '../dist/browser/main'

let assert = chai.assert

describe('Array', function () {
  describe('#indexOf()', function () {
    it('should return -1 when the value is not present', function () {
      embedSvgInline('http://localhost/media/Musik/06/20_Mensch-Zeit/10_Bach/30_Invention/NB/Invention_C-Dur_Loesung.svg', 'svgContainer')
      assert.equal([1, 2, 3].indexOf(4), -1)
    })
  })
})
