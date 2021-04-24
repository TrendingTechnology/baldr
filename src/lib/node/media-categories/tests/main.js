const assert = require('assert')

const { categoriesManagement } = require('../dist/node/main.js')

describe('Package “@bldr/media-categories”', function () {

  it('{ propertyOne: 1 }', function () {
    const result = categoriesManagement.process({ id: 'test', title: 'test' })
    assert.strictEqual(result.id, '---\nproperty_one: 1\n')
  })

})
