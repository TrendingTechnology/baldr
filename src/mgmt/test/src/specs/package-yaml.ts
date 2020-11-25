import { convertFromYaml, convertToYaml } from '@bldr/yaml'

import assert from 'assert'

function assertTo (actual: any, expected: string): void {
  const result = convertToYaml(actual)
  assert.strictEqual(result, expected)
}

function assertFrom (actual: string, expected: any): void {
  const result = convertFromYaml(actual)
  assert.deepStrictEqual(result, expected)
}

describe('Package “@bldr/yaml”', function () {
  describe('function convertObjectToYamlString()', function () {
    it('simple', async function () {
      assertTo({ aProperty: 'A value' }, '---\na_property: A value\n')
    })

    it('nested', async function () {
      assertTo(
        { aProp: { bProp: { cProp: 'A value' } } },
        '---\na_prop:\n  b_prop:\n    c_prop: A value\n'
      )
    })
  })

  describe('function convertYamlStringToObject()', function () {
    it('simple', async function () {
      assertFrom('---\na_property: A value\n', { aProperty: 'A value' })
    })

    it('nested', async function () {
      assertFrom(
        '---\na_prop:\n  b_prop:\n    c_prop: A value\n',
        { aProp: { bProp: { cProp: 'A value' } } }
      )
    })
  })
})
