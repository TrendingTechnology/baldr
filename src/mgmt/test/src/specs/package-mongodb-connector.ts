import { connectDb } from '@bldr/mongodb-connector'

import assert from 'assert'

describe('Package “@bldr/mongodb-connector”', function () {
  it('function connectDb()', async function () {
    const db = await connectDb()
    assert.strictEqual(db.options.authSource, 'baldr')
  })
})
