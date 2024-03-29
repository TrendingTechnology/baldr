import mongodb from 'mongodb'

import { ApiTypes, TitlesTypes } from '@bldr/type-definitions'
import { getConfig } from '@bldr/config'

const config = getConfig()

interface ClientWrapper {
  connect: () => Promise<DatabaseWrapper>

  close: () => Promise<void>
}

interface DatabaseWrapper {
  initialize: () => Promise<any>
  getDocumentCounts: () => Promise<ApiTypes.MediaCount>
  getFolderTitleTree: () => Promise<TitlesTypes.TreeTitleList>
  listUpdateTasks: () => Promise<ApiTypes.MediaUpdateTask[]>
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
  partialFilterExpression?: any
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

export interface FlushMediaResult {
  numberOfDroppedAssets: number
  numberOfDroppedPresentations: number
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
        indexes: [
          { field: 'meta.ref', unique: true },
          {
            field: 'meta.uuid',
            unique: true,
            partialFilterExpression: { 'meta.uuid': { $type: 'string' } }
          }
        ],
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
  public async initialize (): Promise<ApiTypes.DbInitResult> {
    if (!this.isInitialized) {
      const collectionNames = await this.listCollectionNames()

      // https://stackoverflow.com/a/35868933
      for (const collectionName in this.schema) {
        if (!collectionNames.includes(collectionName)) {
          const collection = await this.db.createCollection(collectionName)
          for (const index of this.schema[collectionName].indexes) {
            const options =
              index.partialFilterExpression == null
                ? { unique: index.unique }
                : {
                    unique: index.unique,
                    partialFilterExpression: index.partialFilterExpression
                  }
            await collection.createIndex({ [index.field]: 1 }, options)
          }
        }
      }
      this.isInitialized = true
    }

    const result: ApiTypes.DbInitResult = {}
    for (const collectionName in this.schema) {
      const indexes = await this.db
        .collection(collectionName)
        .listIndexes()
        .toArray()

      const collectionResult: ApiTypes.DbCollectionInitResult = {
        name: collectionName,
        indexes: {}
      }

      result[collectionName] = collectionResult
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
  async drop (): Promise<ApiTypes.DbDroppedCollections> {
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
  async reInitialize (): Promise<ApiTypes.DbReInitResult> {
    const resultDrop = await this.drop()
    const resultInit = await this.initialize()
    return {
      resultDrop,
      resultInit
    }
  }

  /**
   * Delete all media files (assets, presentations) from the database.
   */
  async flushMediaFiles (): Promise<FlushMediaResult> {
    const numberOfDroppedAssets = await this.assets.countDocuments()
    const numberOfDroppedPresentations = await this.presentations.countDocuments()
    await this.assets.deleteMany({})
    await this.presentations.deleteMany({})
    await this.folderTitleTree.deleteMany({})
    return {
      numberOfDroppedAssets,
      numberOfDroppedPresentations
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

  public async listUpdateTasks (): Promise<ApiTypes.MediaUpdateTask[]> {
    return await this.db
      .collection('updates')
      .find({}, { projection: { _id: 0 } })
      .sort({ begin: -1 })
      .limit(20)
      .toArray()
  }

  public async getFolderTitleTree (): Promise<TitlesTypes.TreeTitleList> {
    const result = await this.folderTitleTree
      .find({ ref: 'root' }, { projection: { _id: 0 } })
      .next()
    return result.tree
  }

  /**
   * @param scheme - Has to be `ref` or `uuid`
   * @param authority - The part after the colon: For example
   * `Marmotte` `d2377ef9-1fa6-4ae9-8f9a-7d23942b319e`
   */
  public async getPresentation (
    scheme: 'ref' | 'uuid',
    authority: string
  ): Promise<any> {
    const field = `meta.${scheme}`
    return await this.presentations
      .find({ [field]: authority }, { projection: { _id: 0 } })
      .next()
  }

  /**
   * @param scheme - Has to be `ref` or `uuid`
   * @param authority - The part after the colon: For example
   * `PR_Beethoven_Ludwig-van` `d2377ef9-1fa6-4ae9-8f9a-7d23942b319e`
   */
  public async getAsset (
    scheme: 'ref' | 'uuid',
    authority: string
  ): Promise<any> {
    return await this.assets
      .find({ [scheme]: authority }, { projection: { _id: 0 } })
      .next()
  }

  public async searchPresentationBySubstring (
    substring: string
  ): Promise<ApiTypes.DynamikSelectResult[]> {
    substring = substring.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
    const regex = new RegExp(substring, 'gi')

    return await this.presentations
      .aggregate([
        {
          $match: {
            $or: [
              {
                'meta.title': regex
              },
              {
                'meta.subtitle': regex
              }
            ]
          }
        },
        {
          $project: {
            _id: false,
            ref: '$meta.ref',
            name: {
              $cond: {
                if: '$meta.subtitle',
                then: { $concat: ['$meta.title', ' - ', '$meta.subtitle'] },
                else: '$meta.title'
              }
            }
          }
        }
      ])
      .toArray()
  }

  public async getDocumentCounts (): Promise<ApiTypes.MediaCount> {
    return {
      assets: await this.assets.countDocuments(),
      presentations: await this.presentations.countDocuments()
    }
  }

  public async getAllAssetRefs (): Promise<string[]> {
    return await this.assets.distinct('ref')
  }

  public async getAllAssetUuids (): Promise<string[]> {
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
