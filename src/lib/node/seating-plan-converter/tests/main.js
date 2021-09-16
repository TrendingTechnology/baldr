/* globals describe it */

// const assert = require('assert')

const { convertNotenmanagerMdbToJson } = require('../dist/node/main.js')
const config = require('@bldr/config')

describe('Package “@bldr/seating-plan-converter”', function () {
  it('Function “convertNotenmanagerMdbToJson()”', async function () {
    console.log(config)
    console.log(config.seatingPlan.notenmanagerMdbPath)

    const result = await convertNotenmanagerMdbToJson(config.seatingPlan.notenmanagerMdbPath)

    console.log(result)

    // '/home/jf/Nextcloud/Notenmanager/Fh.mdb'
  })
})
