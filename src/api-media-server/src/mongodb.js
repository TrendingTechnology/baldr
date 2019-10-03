const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017'
const dbName = 'baldr-media-server'
const client = new MongoClient(
  `${url}/${dbName}`,
  { useNewUrlParser: true, useUnifiedTopology: true }
)

async function connectToFiles () {
  await client.connect()
  const db = client.db(dbName)
  return db.collection('files')
}

const queries = {
  flushFiles (db) {
    return db.collection('files').deleteMany({})
  },
  countFiles (db) {
    return db.collection('files').countDocuments()
  },
  queryById (db, id) {
    return db.collection('files').find( { id: id } ).next()
  }
}

async function query (queryName, payload) {
  await client.connect()
  const db = client.db(dbName)
  const result = await queries[queryName](db, payload)
  client.close()
  return result
}

module.exports = query