/* globals describe it beforeEach afterEach */

const assert = require('assert')

const { connectDb, MongoDbClient } = require('../dist/node/main.js')

describe('Package “@bldr/mongodb-connector”', function () {
  it('function “connectDb()”', async function () {
    const mongoClient = await connectDb()
    const db = mongoClient.db()
    assert.strictEqual(db.options.authSource, 'baldr')
    mongoClient.close()
  })

  describe('Class “Database()”', function () {
    let client
    let database

    beforeEach(async function () {
      client = new MongoDbClient()
      database = await client.connect()
      await database.initialize()
    })

    afterEach(async function () {
      await client.close()
    })

    it('Getter methode “getAllAssetUris()”', async function () {
      const uris = await database.getAllAssetUris()
      assert.ok(uris.length > 0)
      assert.strictEqual(typeof uris[0], 'string')
    })
  })
})
