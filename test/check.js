const assert = require('assert')
const path = require('path')
const fs = require('fs-extra')

const CheckChange = require('../check.js')

const rewire = require('rewire')('../check.js')

process.env.PATH = path.join(__dirname, 'bin:', process.env.PATH)

describe('file “check.js”', () => {
  it('object “Sqlite()”', () => {
    let Sqlite = rewire.__get__('Sqlite')
    let db = new Sqlite('test.db')

    db.initialize()
    assert.exists('test.db')

    db.insert('lol', 'toll')
    var row = db.select('lol')
    assert.strictEqual(row.hash, 'toll')

    try {
      db.insert('lol', 'toll')
    } catch (e) {
      assert.strictEqual(e.name, 'SqliteError')
    }

    db.update('lol', 'troll')
    assert.strictEqual(db.select('lol').hash, 'troll')

    fs.unlinkSync('test.db')
  })

  it('function “hashSHA1()”', () => {
    let hashSHA1 = rewire.__get__('hashSHA1')
    assert.strictEqual(
      hashSHA1(path.join('test', 'files', 'hash.txt')),
      '7516f3c75e85c64b98241a12230d62a64e59bce3'
    )
  })

  it('object “CheckChange()”', () => {
    var check = new CheckChange()
    check.init('test.db')
    assert.strictEqual(check.db.dbFile, 'test.db')

    fs.appendFileSync('tmp.txt', 'test')
    assert.ok(check.do('tmp.txt'))

    assert.ok(!check.do('tmp.txt'))
    assert.ok(!check.do('tmp.txt'))

    fs.appendFileSync('tmp.txt', 'test')
    assert.ok(check.do('tmp.txt'))

    fs.unlinkSync('tmp.txt')
    fs.unlinkSync('test.db')
  })
})
