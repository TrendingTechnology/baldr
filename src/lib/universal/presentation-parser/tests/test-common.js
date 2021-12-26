/* globals describe it */

const assert = require('assert')
const {
  parsePresentation
} = require('./_helper.js')

describe('All presentations in files/commons', function () {
  it('Real world example: 12/20_Tradition/10_Umgang-Tradition/10_Futurismus', function () {
    const presentation = parsePresentation(
      'common/allMasters'
    )
    console.log(presentation)
  })

})
