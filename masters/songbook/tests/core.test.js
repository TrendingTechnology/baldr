const assert = require('assert')
const { AlphabeticalSongsTree } = require('@bldr/songbook-core')
const { Library } = require('@bldr/songbook-base')

const path = require('path')

describe('Package “@bldr/songbook-core”', function () {
  describe('Classes', function () {
    describe('Class “AlphabeticalSongsTree()”', function () {

      const library = new Library(path.join(__dirname, 'songs', 'processed', 'some'))
      const songs = Object.values(library.songs)

      it('Initialisation', function () {
        const abcTree = new AlphabeticalSongsTree(songs)
        assert.strictEqual(abcTree.a[0].metaData.title, 'Auf der Mauer, auf der Lauer')
        assert.strictEqual(abcTree.s[0].metaData.title, 'Stille Nacht')
      })
    })
  })
})
