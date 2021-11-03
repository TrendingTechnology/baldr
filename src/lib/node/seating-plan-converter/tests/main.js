/* globals describe it */

const assert = require('assert')

const { convertNotenmanagerMdbToJson } = require('../dist/node/main.js')
const { getConfig } = require('@bldr/config-ng')

const config = getConfig()
describe('Package “@bldr/seating-plan-converter”', function () {
  it('Function “convertNotenmanagerMdbToJson()”', async function () {
    const result = await convertNotenmanagerMdbToJson(config.seatingPlan.notenmanagerMdbPath)
    assert.ok(Object.keys(result.grades).length > 0)
    assert.ok(result.timeStampMsec > 1)
    assert.strictEqual(result.meta.year.length, 7)
  })
})
