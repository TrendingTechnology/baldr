/* globals describe it */

const assert = require('assert')

const { buildSubsetIndexes, selectSubset } = require('../dist/node/main.js')

describe('Function “selectSubset()”', function () {
  it('3-', function () {
    const elements = selectSubset('3-', {
      elementsCount: 5,
      firstElementNo: 1
    })
    assert.deepStrictEqual(elements, [3, 4, 5])
  })

  it('3-', function () {
    const elements = selectSubset('-3', {
      elementsCount: 5,
      firstElementNo: 1
    })
    assert.deepStrictEqual(elements, [1, 2, 3])
  })

  it('1,3,5', function () {
    const elements = selectSubset('1,3,5', {
      elementsCount: 5,
      firstElementNo: 1
    })
    assert.deepStrictEqual(elements, [1, 3, 5])
  })

  it('1-2,4-5', function () {
    const elements = selectSubset('1-2,4-5', {
      elementsCount: 5,
      firstElementNo: 1
    })
    assert.deepStrictEqual(elements, [1, 2, 4, 5])
  })

  it('firstElementNo: unset', function () {
    const elements = selectSubset('', {
      elementsCount: 5
    })
    assert.deepStrictEqual(elements, [0, 1, 2, 3, 4])
  })

  it('subsetSelector undefined', function () {
    const elements = selectSubset(undefined, {
      elementsCount: 5,
      firstElementNo: 1
    })
    assert.deepStrictEqual(elements, [1, 2, 3, 4, 5])
  })

  it('firstElementNo: 1', function () {
    const elements = selectSubset('', {
      elementsCount: 5,
      firstElementNo: 1
    })
    assert.deepStrictEqual(elements, [1, 2, 3, 4, 5])
  })

  it('firstElementNo: 2', function () {
    const elements = selectSubset('', {
      elementsCount: 5,
      firstElementNo: 2
    })
    assert.deepStrictEqual(elements, [2, 3, 4, 5, 6])
  })

  it('shiftSelector: -1', function () {
    const elements = selectSubset('3-', {
      elementsCount: 5,
      firstElementNo: 1,
      shiftSelector: -1
    })
    assert.deepStrictEqual(elements, [2, 3, 4, 5])
  })

  it('shiftSelector: -1 (3-5)', function () {
    const elements = selectSubset('3-5', {
      elementsCount: 5,
      firstElementNo: 1,
      shiftSelector: -1
    })
    assert.deepStrictEqual(elements, [2, 3, 4])
  })

  it('shiftSelector: -1 (-4)', function () {
    const elements = selectSubset('-4', {
      elementsCount: 5,
      firstElementNo: 1,
      shiftSelector: -1
    })
    assert.deepStrictEqual(elements, [1, 2, 3])
  })

  it('shiftSelector: -1 (-4)', function () {
    const elements = selectSubset('-4', {
      elementsCount: 5,
      shiftSelector: -1
    })
    assert.deepStrictEqual(elements, [0, 1, 2])
  })

  it('shiftSelector: -2', function () {
    const elements = selectSubset('3-', {
      elementsCount: 5,
      firstElementNo: 1,
      shiftSelector: -2
    })

    assert.deepStrictEqual(elements, [1, 2, 3, 4, 5])
  })
})

describe('Function “buildSubsetIndexes()”', function () {
  it('One range: From “from” to element count: 3-', function () {
    assert.deepStrictEqual(buildSubsetIndexes('3-', 5), [2, 3, 4])
  })

  it('One range: From 1 to “to”: -3', function () {
    assert.deepStrictEqual(buildSubsetIndexes('-3', 5), [0, 1, 2])
  })

  it('One range: single number: 3', function () {
    assert.deepStrictEqual(buildSubsetIndexes('3', 5), [2])
  })

  it('List of ranges with single numbers: 1,3,5', function () {
    assert.deepStrictEqual(buildSubsetIndexes('1,3,5', 5), [0, 2, 4])
  })

  it('Unsorted ranges', function () {
    assert.deepStrictEqual(buildSubsetIndexes('19,9,1', 20), [0, 8, 18])
  })

  it('1-2,4-5', function () {
    assert.deepStrictEqual(buildSubsetIndexes('1-2,4-5', 20), [0, 1, 3, 4])
  })

  it('too large number for the index shift', function () {
    assert.throws(
      () => {
        buildSubsetIndexes('1', 1, -2)
      },
      {
        message:
          'The index must be greater than 0: -1 (specifier: “1”, element count: 1, index shift: -2)',
        name: 'Error'
      }
    )
  })

  it('Invalid characters', function () {
    assert.throws(
      () => {
        buildSubsetIndexes('1x1', 1)
      },
      {
        message:
          'Only the following characters are allowed as subset specifiers: “0123456789-,” not “1x1”',
        name: 'Error'
      }
    )
  })
})
