/**
 * @module @bldr/media-server/database
 */

import mongodb from 'mongodb'

import config from '@bldr/config'
import type { StringIndexedObject } from '@bldr/type-definitions'

export async function connectDb (): Promise<mongodb.Db> {
  const conf = config.databases.mongodb
  const user = encodeURIComponent(conf.user)
  const password = encodeURIComponent(conf.password)
  const authMechanism = 'DEFAULT'
  const url = `mongodb://${user}:${password}@${conf.url}/${conf.dbName}?authMechanism=${authMechanism}`

  const mongoClient = new mongodb.MongoClient(
    url,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )

  await mongoClient.connect()
  return mongoClient.db(config.databases.mongodb.dbName)
}

/**
 * A wrapper around MongoDB.
 */
export class Database {
  schema: StringIndexedObject

  db: mongodb.Db

  constructor (db: mongodb.Db) {
    this.db = db

    /**
     * @type {Object}
     */
    this.schema = {
      assets: {
        indexes: [
          { field: 'path', unique: true },
          { field: 'id', unique: true },
          { field: 'uuid', unique: true }
        ],
        drop: true
      },
      presentations: {
        indexes: [
          { field: 'id', unique: true }
        ],
        drop: true
      },
      updates: {
        indexes: [
          { field: 'begin', unique: false }
        ],
        drop: true
      },
      folderTitleTree: {
        indexes: [
          { field: 'id', unique: true },
        ],
        drop: true
      },
      seatingPlan: {
        indexes: [
          { timeStampMsec: 'path', unique: true }
        ],
        drop: false
      }
    }
  }

  async connect(): Promise<void> {
    this.db = await connectDb()
  }

  /**
   * List all collection names in an array.
   *
   * @returns An array of collection names.
   */
  async listCollectionNames (): Promise<string[]> {
    const collections = await this.db.listCollections().toArray()
    const names = []
    for (const collection of collections) {
      names.push(collection.name)
    }
    return names
  }

  /**
   * Create the collections with indexes.
   */
  async initialize (): Promise<{ [key: string]: any }> {
    const collectionNames = await this.listCollectionNames()

    // https://stackoverflow.com/a/35868933
    for (const collectionName in this.schema) {
      if (!collectionNames.includes(collectionName)) {
        const collection = await this.db.createCollection(collectionName)
        for (const index of this.schema[collectionName].indexes) {
          await collection.createIndex({ [index.field]: 1 }, { unique: index.unique })
        }
      }
    }

    const result: StringIndexedObject = {}
    for (const collectionName in this.schema) {
      const indexes = await this.db.collection(collectionName).listIndexes().toArray()
      result[collectionName] = {
        name: collectionName,
        indexes: {}
      }
      for (const index of indexes) {
        const unique = index.unique ? 'true' : 'false'
        result[collectionName].indexes[index.name] = `unique: ${unique}`
      }
    }
    return result
  }

  /**
   * Drop all collections except collection which defined drop: false in
   * this.schema
   */
  async drop (): Promise<{ [key: string]: any }> {
    const droppedCollections = []
    for (const collectionName in this.schema) {
      if (this.schema[collectionName].drop === true) {
        await this.db.dropCollection(collectionName)
        droppedCollections.push(collectionName)
      }
    }
    return {
      droppedCollections
    }
  }

  /**
   * Reinitialize the MongoDB database (Drop all collections and initialize).
   */
  async reInitialize (): Promise<{ [key: string]: any }>  {
    const resultdropDb = await this.drop()
    const resultInitializeDb = await this.initialize()
    return {
      resultdropDb,
      resultInitializeDb
    }
  }

  /**
   * Delete all media files (assets, presentations) from the database.
   */
  async flushMediaFiles (): Promise<{ [key: string]: any }>  {
    const countDroppedAssets = await this.assets.countDocuments()
    const countDroppedPresentations = await this.presentations.countDocuments()
    await this.assets.deleteMany({})
    await this.presentations.deleteMany({})
    await this.folderTitleTree.deleteMany({})
    return {
      countDroppedAssets, countDroppedPresentations
    }
  }

  get assets () {
    return this.db.collection('assets')
  }

  get presentations () {
    return this.db.collection('presentations')
  }

  get updates () {
    return this.db.collection('updates')
  }

  get folderTitleTree () {
    return this.db.collection('folderTitleTree')
  }

  get seatingPlan () {
    return this.db.collection('seatingPlan')
  }
}
