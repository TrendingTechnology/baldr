const MongoClient = require('mongodb').MongoClient

// Project packages.
const { bootstrapConfig } = require('@bldr/core-node')

/**
 * The configuration object from `/etc/baldr.json`
 */
const config = bootstrapConfig()

/**
 *
 */
function setupMongoUrl () {
  const conf = config.databases.mongodb
  const user = encodeURIComponent(conf.user)
  const password = encodeURIComponent(conf.password)
  const authMechanism = 'DEFAULT'
  const url = `mongodb://${user}:${password}@${conf.url}/${conf.dbName}?authMechanism=${authMechanism}`
  return url
}

/**
 *
 */
const mongoClient = new MongoClient(
  setupMongoUrl(),
  { useNewUrlParser: true, useUnifiedTopology: true }
)

/**
 * The MongoDB Db instance
 * @type {Object}
 */
let db

/**
 * @return {Promise}
 */
async function connectDb () {
  if (!db) {
    await mongoClient.connect()
    db = mongoClient.db(config.databases.mongodb.dbName)
    return db
  }
}

/**
 * List all collection names in an array.
 *
 * @returns An array of collection names.
 */
async function listCollectionNames () {
  const collections = await db.listCollections().toArray()
  const names = []
  for (const collection of collections) {
    names.push(collection.name)
  }
  return names
}

/**
 * @returns {Promise}
 */
async function initializeDb () {
  let collections = await listCollectionNames()
  if (!collections.includes('assets')) {
    const assets = await db.createCollection('assets')
    await assets.createIndex({ path: 1 }, { unique: true })
    await assets.createIndex({ id: 1 }, { unique: true })
    await assets.createIndex({ uuid: 1 }, { unique: true })
  }

  if (!collections.includes('presentations')) {
    const presentations = await db.createCollection('presentations')
    await presentations.createIndex({ id: 1 }, { unique: true })
  }

  if (!collections.includes('updates')) {
    const updates = await db.createCollection('updates')
    await updates.createIndex({ begin: 1 })
  }

  if (!collections.includes('folderTitleTree')) {
    // https://stackoverflow.com/a/35868933
    const folderTitleTree = await db.createCollection('folderTitleTree')
    await folderTitleTree.createIndex({ id: 1 }, { unique: true })
  }

  if (!collections.includes('seatingPlan')) {
    const seatingPlan = await db.createCollection('seatingPlan')
    await seatingPlan.createIndex({ timeStampMsec: 1 }, { unique: true })
  }

  const result = {}
  collections = await db.listCollections().toArray()
  for (const collection of collections) {
    const indexes = await db.collection(collection.name).listIndexes().toArray()
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
async function dropDb () {
  const collections = await db.listCollections().toArray()
  const droppedCollections = []
  for (const collection of collections) {
    await db.dropCollection(collection.name)
    droppedCollections.push(collection.name)
  }
  return {
    droppedCollections
  }
}

/**
 * @returns {Promise}
 */
async function reInitializeDb () {
  const resultdropDb = await dropDb()
  const resultInitializeDb = await initializeDb()
  return {
    resultdropDb,
    resultInitializeDb
  }
}

/**
 * @returns {Promise}
 */
async function flushMediaFiles () {
  await db.collection('assets').deleteMany({})
  await db.collection('presentations').deleteMany({})
}
