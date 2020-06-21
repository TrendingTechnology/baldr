const assert = require('assert')

const selectSubset = require('../dist/main.js').selectSubset

describe('function selectSubset()', function () {
  it('3-', function () {
    const elements = selectSubset('3-', {
      elementsCount: 5,
      firstElementNo: 1
    })
    assert.deepEqual(elements, [3, 4, 5])
  })

  it('3-', function () {
    const elements = selectSubset('-3', {
      elementsCount: 5,
      firstElementNo: 1
    })
    assert.deepEqual(elements, [1, 2, 3])
  })

  it('1,3,5', function () {
    const elements = selectSubset('1,3,5', {
      elementsCount: 5,
      firstElementNo: 1
    })
    assert.deepEqual(elements, [1, 3, 5])
  })

  it('1-2,4-5', function () {
    const elements = selectSubset('1-2,4-5', {
      elementsCount: 5,
      firstElementNo: 1
    })
    assert.deepEqual(elements, [1, 2, 4, 5])
  })

  it('firstElementNo: unset', function () {
    const elements = selectSubset('', {
      elementsCount: 5,
    })
    assert.deepEqual(elements, [0, 1, 2, 3, 4])
  })

  it('firstElementNo: 1', function () {
    const elements = selectSubset('', {
      elementsCount: 5,
      firstElementNo: 1
    })
    assert.deepEqual(elements, [1, 2, 3, 4, 5])
  })

  it('firstElementNo: 2', function () {
    const elements = selectSubset('', {
      elementsCount: 5,
      firstElementNo: 2
    })
    assert.deepEqual(elements, [2, 3, 4, 5, 6])
  })

  it('shiftSelector: -1', function () {
    const elements = selectSubset('3-', {
      elementsCount: 5,
      firstElementNo: 1,
      shiftSelector: -1
    })
    assert.deepEqual(elements, [2, 3, 4, 5])
  })

  it('shiftSelector: -1 (3-5)', function () {
    const elements = selectSubset('3-5', {
      elementsCount: 5,
      firstElementNo: 1,
      shiftSelector: -1
    })
    assert.deepEqual(elements, [2, 3, 4])
  })

  it('shiftSelector: -1 (-4)', function () {
    const elements = selectSubset('-4', {
      elementsCount: 5,
      firstElementNo: 1,
      shiftSelector: -1
    })
    assert.deepEqual(elements, [1, 2, 3])
  })

  it('shiftSelector: -1 (-4)', function () {
    const elements = selectSubset('-4', {
      elementsCount: 5,
      shiftSelector: -1
    })
    assert.deepEqual(elements, [0, 1, 2])
  })

  it('shiftSelector: -2', function () {
    const elements = selectSubset('3-', {
      elementsCount: 5,
      firstElementNo: 1,
      shiftSelector: -2
    })

    assert.deepEqual(elements, [1, 2, 3, 4, 5])
  })
})
