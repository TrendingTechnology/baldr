const assert = require('assert')
const { Db } = require('mongodb')

const { connectDb } = require('../dist/node/main.js')

describe('Package “@bldr/mongodb-connector”', function () {
  it('function connectDb()', async function () {
    const db = await connectDb()
    assert.strictEqual(db.options.authSource, 'baldr')
  })
})
