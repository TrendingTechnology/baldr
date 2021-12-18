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

    it('Getter methode “listUpdateTasks()”', async function () {
      const updates = await database.listUpdateTasks()
      const updateTask = updates[0]
      assert.strictEqual(typeof updateTask.begin, 'number')
      assert.strictEqual(typeof updateTask.end, 'number')
      assert.strictEqual(typeof updateTask.lastCommitId, 'string')
    })

    it('Getter methode “getFolderTitleTree()”', async function () {
      const tree = await database.getFolderTitleTree()
      assert.ok(tree.Musik != null)
    })

    it('Getter methode “getDocumentCounts()”', async function () {
      const counts = await database.getDocumentCounts()
      assert.ok(counts.assets > 0)
      assert.ok(counts.presentations > 0)
    })

    it('Getter methode “getAllAssetUris()”', async function () {
      const uris = await database.getAllAssetUris()
      assert.ok(uris.length > 0)
      assert.strictEqual(typeof uris[0], 'string')
    })

    it('Getter methode “getPresentationByRef()”', async function () {
      const presentation = await database.getPresentationByRef('Marmotte')
      assert.strictEqual(presentation.meta.ref, 'Marmotte')
    })
  })
})
