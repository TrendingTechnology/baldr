const assert = require('assert')

const { connectDb } = require('../dist/node/main.js')

describe('Package “@bldr/mongodb-connector”', function () {
  it('function connectDb()', async function () {
    const mongoClient = await connectDb()
    const db = mongoClient.db()
    assert.strictEqual(db.options.authSource, 'baldr')
    mongoClient.close()
  })
})
