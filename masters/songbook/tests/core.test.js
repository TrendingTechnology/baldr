const assert = require('assert')
const baseRewired = require('rewire')('@bldr/songbook-base')
const { AlphabeticalSongsTree, SongMetaDataCombined } = require('@bldr/songbook-core')
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

    describe('Class “SongMetaDataCombined()”', function () {
      describe('get title', function () {
        it('title only', function () {
          const song = new SongMetaDataCombined({ title: 'lol' })
          assert.strictEqual(song.title, 'lol')
        })
        it('title and year', function () {
          const song = new SongMetaDataCombined({ title: 'lol', year: 1984 })
          assert.strictEqual(song.title, 'lol (1984)')
        })
      })

      describe('get subtitle', function () {
        it('all properties', function () {
          const song = new SongMetaDataCombined({ subtitle: 's', alias: 'a', country: 'c' })
          assert.strictEqual(song.subtitle, 's - a - c')
        })
        it('no properties', function () {
          const song = new SongMetaDataCombined({})
          assert.strictEqual(song.subtitle, '')
        })
      })

      describe('get composer', function () {
        it('all properties', function () {
          const song = new SongMetaDataCombined({ composer: 'c', artist: 'a', genre: 'g' })
          assert.strictEqual(song.composer, 'c, a, g')
        })

        it('artist and composer are identical', function () {
          const song = new SongMetaDataCombined({ composer: 'i', artist: 'i', genre: 'g' })
          assert.strictEqual(song.composer, 'i, g')
        })

        it('no properties', function () {
          const song = new SongMetaDataCombined({})
          assert.strictEqual(song.composer, '')
        })
      })

      describe('get lyricist', function () {
        it('all properties', function () {
          const song = new SongMetaDataCombined({ lyricist: 'l' })
          assert.strictEqual(song.lyricist, 'l')
        })

        it('lyricist and composer are identical', function () {
          const song = new SongMetaDataCombined({ lyricist: 'i', composer: 'i' })
          assert.strictEqual(song.lyricist, '')
        })

        it('lyricist and artist are identical', function () {
          const song = new SongMetaDataCombined({ lyricist: 'i', artist: 'i' })
          assert.strictEqual(song.lyricist, '')
        })

        it('no properties', function () {
          const song = new SongMetaDataCombined({})
          assert.strictEqual(song.lyricist, '')
        })
      })

      describe('get wikipediaURL', function () {
        it('de', function () {
          const song = new SongMetaDataCombined({
            wikipedia: 'de:Geschütztes_Leerzeichen'
          })
          assert.strictEqual(
            song.wikipediaURL,
            'https://de.wikipedia.org/wiki/Gesch%C3%BCtztes_Leerzeichen'
          )
        })

        it('en', function () {
          const song = new SongMetaDataCombined({
            wikipedia: 'en:Non-breaking_space'
          })
          assert.strictEqual(
            song.wikipediaURL,
            'https://en.wikipedia.org/wiki/Non-breaking_space'
          )
        })
      })

      it('get youtubeURL', function () {
        const song = new SongMetaDataCombined({
          youtube: 'ESRwx36lvOM'
        })
        assert.strictEqual(
          song.youtubeURL,
          'https://youtu.be/ESRwx36lvOM'
        )
      })

      it('get musescoreURL', function () {
        const song = new SongMetaDataCombined({
          musescore: 1234
        })
        assert.strictEqual(
          song.musescoreURL,
          'https://musescore.com/score/1234'
        )
      })

      describe('Real world example', function () {
        const SongMetaData = baseRewired.__get__('SongMetaData')
        const folder = path.join(__dirname, 'songs', 'clean', 'some', 'a', 'Auf-der-Mauer')
        const metaData = new SongMetaData(folder)
        const combined = new SongMetaDataCombined(metaData)

        it('title', function () {
          assert.strictEqual(combined.title, 'Auf der Mauer, auf der Lauer (1890)')
        })

        it('subtitle', function () {
          assert.strictEqual(combined.subtitle, 'Deutschland')
        })

        it('composer', function () {
          assert.strictEqual(combined.composer, 'Georg Lehmann')
        })

        it('lyricist', function () {
          assert.strictEqual(combined.lyricist, 'unbekannt')
        })

        it('toJSON', function () {
          const combinedJSON = JSON.parse(JSON.stringify(combined))
          assert.deepStrictEqual(
            combinedJSON,
            {
              composer: 'Georg Lehmann',
              lyricist: 'unbekannt',
              subtitle: 'Deutschland',
              title: 'Auf der Mauer, auf der Lauer (1890)'
            }
          )
        })
      })
    })
  })
})
