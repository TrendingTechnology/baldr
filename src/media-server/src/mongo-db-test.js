#! /usr/bin/env node
const MongoClient = require('mongodb').MongoClient

async function main() {
  let mongoClient = new MongoClient(
    'mongodb://baldr:h2uh60nmeBUIwfI@localhost:27017/baldr?authMechanism=DEFAULT',
    { useNewUrlParser: true, useUnifiedTopology: true }
  )

  await mongoClient.connect()
  let db = mongoClient.db('baldr')
  result = await db.collection("seatingPlan").aggregate([{ $match: {}}, {$project: { timeStampMsec: 1, _id: 0 }}]).toArray()
  console.log(result)
}

main()
