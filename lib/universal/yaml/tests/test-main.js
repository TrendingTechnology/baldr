/* globals describe it */

import assert from 'assert'

import { convertToYaml, convertFromYaml } from '../dist/main'

function assertTo (actual, expected) {
  const result = convertToYaml(actual)
  assert.strictEqual(result, expected)
}

function assertFrom (actual, expected) {
  const result = convertFromYaml(actual)
  assert.deepStrictEqual(result, expected)
}

describe('Package “@bldr/yaml”', function () {
  describe('Function “convertToYaml()”', function () {
    it('{ propertyOne: 1 }', function () {
      assert.strictEqual(
        convertToYaml({ propertyOne: 1 }),
        '---\nproperty_one: 1\n'
      )
    })

    it("{ aProperty: 'A value' }", async function () {
      assertTo({ aProperty: 'A value' }, '---\na_property: A value\n')
    })

    it('nested', async function () {
      assertTo(
        { aProp: { bProp: { cProp: 'A value' } } },
        '---\na_prop:\n  b_prop:\n    c_prop: A value\n'
      )
    })
  })

  describe('Function “convertFromYaml()”', function () {
    it('---\\nproperty_one: 1\\n', function () {
      const result = convertFromYaml('---\nproperty_one: 1\n')
      assert.strictEqual(result.propertyOne, 1)
    })

    it('---\\na_property: A value\\n', async function () {
      assertFrom('---\na_property: A value\n', { aProperty: 'A value' })
    })

    it('nested', async function () {
      assertFrom('---\na_prop:\n  b_prop:\n    c_prop: A value\n', {
        aProp: { bProp: { cProp: 'A value' } }
      })
    })
  })
})
