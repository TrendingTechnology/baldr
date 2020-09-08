#! /usr/bin/env node
const MongoClient = require('mongodb').MongoClient

async function main () {
  const mongoClient = new MongoClient(
    'mongodb://baldr:h2uh60nmeBUIwfI@localhost:27017/baldr?authMechanism=DEFAULT',
    { useNewUrlParser: true, useUnifiedTopology: true }
  )

  await mongoClient.connect()
  const db = mongoClient.db('baldr')
  // result = await db.collection("seatingPlan").aggregate([{ $match: {}}, {$project: { timeStampMsec: 1, _id: 0 }}]).toArray()

  const result = await db.collection('seatingPlan').find({ timeStampMsec: 1599417947161 }).toArray()

  console.log(result)
}

main()
