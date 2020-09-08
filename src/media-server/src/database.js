/**
 * @module @bldr/media-server/database
 */

const mongodb = require('mongodb')

// Project packages.
const { bootstrapConfig } = require('@bldr/core-node')

/**
 * The configuration object from `/etc/baldr.json`
 */
const config = bootstrapConfig()

/**
 * A wrapper around MongoDB.
 */
class Database {
  constructor () {
    const conf = config.databases.mongodb
    const user = encodeURIComponent(conf.user)
    const password = encodeURIComponent(conf.password)
    const authMechanism = 'DEFAULT'
    const url = `mongodb://${user}:${password}@${conf.url}/${conf.dbName}?authMechanism=${authMechanism}`

    /**
     * @private
     */
    this.mongoClient_ = new mongodb.MongoClient(
      url,
      { useNewUrlParser: true, useUnifiedTopology: true }
    )

    /**
     * @type{mongodb.Db}
     */
    this.db = null
  }

  /**
   * @return {Promise}
   */
  async connect () {
    if (!this.db) {
      await this.mongoClient_.connect()
      this.db = this.mongoClient_.db(config.databases.mongodb.dbName)
    }
  }

  /**
   * List all collection names in an array.
   *
   * @returns An array of collection names.
   */
  async listCollectionNames () {
    const collections = await this.db.listCollections().toArray()
    const names = []
    for (const collection of collections) {
      names.push(collection.name)
    }
    return names
  }

  /**
   * @returns {Promise}
   */
  async initialize () {
    let collections = await this.listCollectionNames()
    if (!collections.includes('assets')) {
      const assets = await this.db.createCollection('assets')
      await assets.createIndex({ path: 1 }, { unique: true })
      await assets.createIndex({ id: 1 }, { unique: true })
      await assets.createIndex({ uuid: 1 }, { unique: true })
    }

    if (!collections.includes('presentations')) {
      const presentations = await this.db.createCollection('presentations')
      await presentations.createIndex({ id: 1 }, { unique: true })
    }

    if (!collections.includes('updates')) {
      const updates = await this.db.createCollection('updates')
      await updates.createIndex({ begin: 1 })
    }

    if (!collections.includes('folderTitleTree')) {
      // https://stackoverflow.com/a/35868933
      const folderTitleTree = await this.db.createCollection('folderTitleTree')
      await folderTitleTree.createIndex({ id: 1 }, { unique: true })
    }

    if (!collections.includes('seatingPlan')) {
      const seatingPlan = await this.db.createCollection('seatingPlan')
      await seatingPlan.createIndex({ timeStampMsec: 1 }, { unique: true })
    }

    const result = {}
    collections = await this.db.listCollections().toArray()
    for (const collection of collections) {
      const indexes = await this.db.collection(collection.name).listIndexes().toArray()
      result[collection.name] = {
        name: collection.name,
        indexes: {}
      }
      for (const index of indexes) {
        result[collection.name].indexes[index.name] = index.unique
      }
    }
    return result
  }

  /**
   * @returns {Promise}
   */
  async drop () {
    const collections = await this.db.listCollections().toArray()
    const droppedCollections = []
    for (const collection of collections) {
      await this.db.dropCollection(collection.name)
      droppedCollections.push(collection.name)
    }
    return {
      droppedCollections
    }
  }

  /**
   * @returns {Promise}
   */
  async reInitialize () {
    const resultdropDb = await this.drop()
    const resultInitializeDb = await this.initialize()
    return {
      resultdropDb,
      resultInitializeDb
    }
  }

  /**
   * @returns {Promise}
   */
  async flushMediaFiles () {
    await this.db.collection('assets').deleteMany({})
    await this.db.collection('presentations').deleteMany({})
  }
}

module.exports = {
  Database
}
