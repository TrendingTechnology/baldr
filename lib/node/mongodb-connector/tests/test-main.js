/* globals describe it beforeEach afterEach */

const assert = require('assert')

const { connectDb, MongoDbClient } = require('../dist/main.js')

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

    it('Getter method “listUpdateTasks()”', async function () {
      const updates = await database.listUpdateTasks()
      const updateTask = updates[0]
      assert.strictEqual(typeof updateTask.begin, 'number')
      assert.strictEqual(typeof updateTask.end, 'number')
      assert.strictEqual(typeof updateTask.lastCommitId, 'string')
    })

    it('Getter method “getFolderTitleTree()”', async function () {
      const tree = await database.getFolderTitleTree()
      assert.ok(tree.Musik != null)
    })

    it('Getter method “getDocumentCounts()”', async function () {
      const counts = await database.getDocumentCounts()
      assert.ok(counts.assets > 0)
      assert.ok(counts.presentations > 0)
    })

    it('Getter method “getAllAssetUris()”', async function () {
      const uris = await database.getAllAssetUris()
      assert.ok(uris.length > 0)
      assert.strictEqual(typeof uris[0], 'string')
    })

    describe('Method “getPresentation()”', function () {
      it('by ref', async function () {
        const presentation = await database.getPresentation('ref', 'Marmotte')
        assert.strictEqual(
          presentation.meta.uuid,
          'de007e7e-b255-4a4e-92a1-0819d7f046cf'
        )
      })

      it('by uuid', async function () {
        const presentation = await database.getPresentation(
          'uuid',
          'de007e7e-b255-4a4e-92a1-0819d7f046cf'
        )
        assert.strictEqual(presentation.meta.ref, 'Marmotte')
      })
    })

    describe('Method “getAsset()”', function () {
      it('by ref', async function () {
        const asset = await database.getAsset(
          'ref',
          'Marmotte_HB_Fischer-Dieskau_Marmotte'
        )
        assert.strictEqual(asset.uuid, '88ad5df3-d7f9-4e9e-9522-e205f51eedb3')
      })

      it('by uuid', async function () {
        const asset = await database.getAsset(
          'uuid',
          '88ad5df3-d7f9-4e9e-9522-e205f51eedb3'
        )
        assert.strictEqual(asset.ref, 'Marmotte_HB_Fischer-Dieskau_Marmotte')
      })
    })

    it('Getter method “searchPresentationBySubstring()”', async function () {
      const results = await database.searchPresentationBySubstring('Beethoven')
      assert.strictEqual(typeof results[0].ref, 'string')
      assert.strictEqual(typeof results[0].name, 'string')
    })
  })
})
