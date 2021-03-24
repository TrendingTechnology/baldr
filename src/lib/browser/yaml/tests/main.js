const assert = require('assert')

const { convertToYaml, convertFromYaml } = require('../dist/node/main.js')

describe('Methods', function () {
  it('Method “convertToYaml()”', function () {
    assert.strictEqual(convertToYaml({ propertyOne: 1 }), '---\nproperty_one: 1\n')
  })

  it('Method “convertFromYaml()”', function () {
    const result = convertFromYaml('---\nproperty_one: 1\n')
    assert.strictEqual(result.propertyOne, 1)
  })
})
