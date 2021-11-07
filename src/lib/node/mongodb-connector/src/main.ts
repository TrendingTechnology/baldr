/**
 * @module @bldr/media-server/database
 */

import mongodb from 'mongodb'

import { StringIndexedObject } from '@bldr/type-definitions'
import { getConfig } from '@bldr/config-ng'

const config = getConfig()

interface ClientWrapper {
  connect: () => Promise<DatabaseWrapper>

  close: () => Promise<void>
}

interface DatabaseWrapper {
  initialize: () => Promise<any>
  getAllAssetUris: () => Promise<string[]>
}

export class MongoDbClient implements ClientWrapper {
  private readonly client: mongodb.MongoClient

  private database?: DatabaseWrapper

  constructor () {
    const conf = config.databases.mongodb
    const user = encodeURIComponent(conf.user)
    const password = encodeURIComponent(conf.password)
    const authMechanism = 'DEFAULT'
    const url = `mongodb://${user}:${password}@${conf.url}/${conf.dbName}?authMechanism=${authMechanism}`

    this.client = new mongodb.MongoClient(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
  }

  /**
   * Connect to the MongoDB database as a client, create a database wrapper object and
   * initialize the database.
   */
  async connect (): Promise<DatabaseWrapper> {
    if (!this.client.isConnected()) {
      await this.client.connect()
    }
    if (this.database == null) {
      this.database = new Database(
        this.client.db(config.databases.mongodb.dbName)
      )
      await this.database.initialize()
    }
    return this.database
  }

  async close (): Promise<void> {
    await this.client.close()
  }
}

/**
 * Connect to the MongoDB server.
 */
export async function connectDb (): Promise<mongodb.MongoClient> {
  const conf = config.databases.mongodb
  const user = encodeURIComponent(conf.user)
  const password = encodeURIComponent(conf.password)
  const authMechanism = 'DEFAULT'
  const url = `mongodb://${user}:${password}@${conf.url}/${conf.dbName}?authMechanism=${authMechanism}`

  const mongoClient = new mongodb.MongoClient(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })

  await mongoClient.connect()
  mongoClient.db(config.databases.mongodb.dbName)
  return mongoClient
}

interface IndexDefinition {
  field: string
  unique: boolean
}

interface CollectionDefinition {
  indexes: IndexDefinition[]
  drop: boolean
}

interface DbSchema {
  [key: string]: CollectionDefinition
}

/**
 * Connect and initialize the MongoDB database.
 */
export async function getDatabaseWrapper (): Promise<Database> {
  const mongoClient = await connectDb()
  const database = new Database(mongoClient.db())
  await database.initialize()
  return database
}

/**
 * A wrapper around MongoDB.
 */
export class Database implements DatabaseWrapper {
  private readonly schema: DbSchema

  public db: mongodb.Db

  private isInitialized: boolean = false

  constructor (db: mongodb.Db) {
    this.db = db

    this.schema = {
      assets: {
        indexes: [
          { field: 'path', unique: true },
          { field: 'ref', unique: true },
          { field: 'uuid', unique: true }
        ],
        drop: true
      },
      presentations: {
        indexes: [{ field: 'ref', unique: true }],
        drop: true
      },
      updates: {
        indexes: [{ field: 'begin', unique: false }],
        drop: true
      },
      folderTitleTree: {
        indexes: [{ field: 'ref', unique: true }],
        drop: true
      },
      seatingPlan: {
        indexes: [{ field: 'timeStampMsec', unique: true }],
        drop: false
      }
    }
  }

  /**
   * @TODO Remove
   */
  async connect (): Promise<void> {
    const mongoClient = await connectDb()
    this.db = mongoClient.db(config.databases.mongodb.dbName)
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
  public async initialize (): Promise<{ [key: string]: any }> {
    if (!this.isInitialized) {
      const collectionNames = await this.listCollectionNames()

      // https://stackoverflow.com/a/35868933
      for (const collectionName in this.schema) {
        if (!collectionNames.includes(collectionName)) {
          const collection = await this.db.createCollection(collectionName)
          for (const index of this.schema[collectionName].indexes) {
            await collection.createIndex(
              { [index.field]: 1 },
              { unique: index.unique }
            )
          }
        }
      }
      this.isInitialized = true
    }

    const result: StringIndexedObject = {}
    for (const collectionName in this.schema) {
      const indexes = await this.db
        .collection(collectionName)
        .listIndexes()
        .toArray()
      result[collectionName] = {
        name: collectionName,
        indexes: {}
      }
      for (const index of indexes) {
        const indexDefinition = index as IndexDefinition
        const unique = indexDefinition.unique ? 'true' : 'false'
        result[collectionName].indexes[index.name] = `unique: ${unique}`
      }
    }
    return result
  }

  /**
   * Drop all collections except collection which defined `{drop: false}` in
   * `this.schema`
   */
  async drop (): Promise<{ [key: string]: any }> {
    const droppedCollections = []
    for (const collectionName in this.schema) {
      if (this.schema[collectionName].drop) {
        await this.db.dropCollection(collectionName)
        droppedCollections.push(collectionName)
      }
    }
    this.isInitialized = false
    return {
      droppedCollections
    }
  }

  /**
   * Reinitialize the MongoDB database (Drop all collections and initialize).
   */
  async reInitialize (): Promise<{ [key: string]: any }> {
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
  async flushMediaFiles (): Promise<{ [key: string]: any }> {
    const countDroppedAssets = await this.assets.countDocuments()
    const countDroppedPresentations = await this.presentations.countDocuments()
    await this.assets.deleteMany({})
    await this.presentations.deleteMany({})
    await this.folderTitleTree.deleteMany({})
    return {
      countDroppedAssets,
      countDroppedPresentations
    }
  }

  get assets (): mongodb.Collection<any> {
    return this.db.collection('assets')
  }

  get presentations (): mongodb.Collection<any> {
    return this.db.collection('presentations')
  }

  get updates (): mongodb.Collection<any> {
    return this.db.collection('updates')
  }

  get folderTitleTree (): mongodb.Collection<any> {
    return this.db.collection('folderTitleTree')
  }

  get seatingPlan (): mongodb.Collection<any> {
    return this.db.collection('seatingPlan')
  }

  private async getAllAssetRefs (): Promise<string[]> {
    return await this.assets.distinct('ref')
  }

  private async getAllAssetUuids (): Promise<string[]> {
    return await this.assets.distinct('uuid')
  }

  public async getAllAssetUris (): Promise<string[]> {
    const refs = await this.getAllAssetRefs()
    const uuids = await this.getAllAssetUuids()

    const uris = []
    for (const ref of refs) {
      uris.push(`ref:${ref}`)
    }

    for (const uuid of uuids) {
      uris.push(`uuid:${uuid}`)
    }
    return uris
  }
}
