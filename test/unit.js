const { bootstrapConfig, Library, SongMetaData } = require('../src/without-dom.js')
const assert = require('assert')
const path = require('path')

describe('Function “bootstrapConfig”', () => {
  before(() => {
    process.env.BALDR_SONGBOOK_PATH = '/lol'
  })

  it('BALDR_SONGBOOK_PATH', () => {
    let config = bootstrapConfig()
    assert.strictEqual(config.path, '/lol')
  })
})

describe('Class “Library”', () => {
  before(() => {
    this.library = new Library(path.join(__dirname, 'songs', 'songs.json'))
  })

  describe('properties', () => {
    it('tree', () => {
      assert.ok(this.library.tree)
      assert.strictEqual(
        this.library.tree.a['Auf-der-Mauer_auf-der-Lauer'].title,
        'Auf der Mauer, auf der Lauer'
      )
    })
    it('list', () => {
      assert.ok(this.library.list)
      assert.strictEqual(
        this.library.list['Auf-der-Mauer_auf-der-Lauer'].title,
        'Auf der Mauer, auf der Lauer'
      )
    })
  })

  describe('methods', () => {
    it('flattenTree_', () => {
      Library.flattenTree_(this.library.tree)
    })
  })
})

describe('Class “SongMetaData”', () => {
  describe('get title', () => {
    it('title only', () => {
      let song = new SongMetaData({ 'title': 'lol' })
      assert.strictEqual(song.title, 'lol')
    })
    it('title and year', () => {
      let song = new SongMetaData({ 'title': 'lol', 'year': 1984 })
      assert.strictEqual(song.title, 'lol (1984)')
    })
  })

  describe('get subtitle', () => {
    it('all properties', () => {
      let song = new SongMetaData({ 'subtitle': 's', 'alias': 'a', 'country': 'c' })
      assert.strictEqual(song.subtitle, 's - a - c')
    })
    it('no properties', () => {
      let song = new SongMetaData({})
      assert.strictEqual(song.subtitle, '')
    })
  })

  describe('get composer', () => {
    it('all properties', () => {
      let song = new SongMetaData({ 'composer': 'c', 'artist': 'a', 'genre': 'g' })
      assert.strictEqual(song.composer, 'c, a, g')
    })
    it('no properties', () => {
      let song = new SongMetaData({})
      assert.strictEqual(song.composer, '')
    })
  })

  describe('get lyricist', () => {
    it('all properties', () => {
      let song = new SongMetaData({ 'lyricist': 'l' })
      assert.strictEqual(song.lyricist, 'l')
    })
    it('no properties', () => {
      let song = new SongMetaData({})
      assert.strictEqual(song.lyricist, '')
    })
  })
})
