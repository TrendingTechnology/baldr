const { assert } = require('./lib/helper.js')
const path = require('path')
const fs = require('fs-extra')
const json = require('../json.js')
const rewire = require('rewire')('../json.js')

describe('file “json.js”', () => {
  it('function “generateSongJSON()”', () => {
    var info = rewire.__get__('generateSongJSON')(path.join(
      path.resolve('test', 'songs', 'processed', 'some'),
      'a',
      'Auf-der-Mauer_auf-der-Lauer'
    ))
    assert.strictEqual(
      info.title,
      'Auf der Mauer, auf der Lauer'
    )
  })

  it('function “generateJSON()”', () => {
    var ymlFile = path.join('test', 'songs', 'processed', 'some', 'songs.json')
    json.generateJSON(path.join('test', 'songs', 'processed', 'some'))
    assert.exists(ymlFile)
    var tree = JSON.parse(fs.readFileSync(ymlFile, 'utf8'))
    assert.strictEqual(
      tree.a['Auf-der-Mauer_auf-der-Lauer'].title,
      'Auf der Mauer, auf der Lauer'
    )
    fs.removeSync(ymlFile)
  })

  it('function “readJSON()”', () => {
    json.generateJSON(path.resolve('test', 'songs', 'processed', 'some'))
    var jsonContent = json.readJSON(path.resolve('test', 'songs', 'processed', 'some'))
    assert.strictEqual(
      jsonContent.a['Auf-der-Mauer_auf-der-Lauer'].title,
      'Auf der Mauer, auf der Lauer'
    )
  })
})
