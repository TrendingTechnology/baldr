/* jshint esversion: 6 */

const assert = require('assert');
const path = require('path');
const fs = require('fs-extra');

const CheckChange = require('../file-changed.js');

const rewire = require('rewire')('../file-changed.js');

before(function() {
  process.env.PATH = __dirname + '/bin:' + process.env.PATH;
});

describe('file-changed.js', () => {

  it('"Object Sqlite()"', () => {
    let Sqlite = rewire.__get__('Sqlite');
    let db = new Sqlite('test.db');

    db.initialize();
    assert.exists('test.db');

    db.insert('lol', 'toll');
    var row = db.select('lol');
    assert.equal(row.hash, 'toll');

    try {
      db.insert('lol', 'toll');
    }
    catch (e) {
      assert.equal(e.name, 'SqliteError');
    }

    db.update('lol', 'troll');
    assert.equal(db.select('lol').hash, 'troll');

    fs.unlinkSync('test.db');
  });

  it('"hashSHA1()"', () => {
    let hashSHA1 = rewire.__get__('hashSHA1');
    assert.equal(
      hashSHA1(path.join('test', 'files', 'hash.txt')),
      '7516f3c75e85c64b98241a12230d62a64e59bce3'
    );
  });

  it('"Object CheckChange()"', () => {
    var check = new CheckChange();
    let db = check.init('test.db');
    assert.equal(db.dbFile, 'test.db');

    fs.appendFileSync('tmp.txt', 'test');
    assert.ok(check.do('tmp.txt'));

    assert.ok(!check.do('tmp.txt'));
    assert.ok(!check.do('tmp.txt'));

    fs.appendFileSync('tmp.txt', 'test');
    assert.ok(check.do('tmp.txt'));

    fs.unlinkSync('tmp.txt');
    fs.unlinkSync('test.db');
  });

});
