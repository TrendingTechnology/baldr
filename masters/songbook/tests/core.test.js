const assert = require('assert')
const baseRewired = require('rewire')('@bldr/songbook-base')
const {
  AlphabeticalSongsTree,
  CoreLibrary,
  SongMetaDataCombined
} = require('@bldr/songbook-core')
const { Library } = require('@bldr/songbook-base')

const path = require('path')

const songs = {
  'Auf-der-Mauer': {
    abc: 'a',
    folder: '/tmp/a/Auf-der-Mauer',
    metaData: {
      artist: 'Volksweise',
      musescore: 5354717,
      title: 'Auf der Mauer, auf der Lauer'
    },
    songID: 'Auf-der-Mauer',
    slidesCount: 4
  },
  'Stille-Nacht': {
    abc: 's',
    folder: '/tmp/s/Stille-Nacht',
    metaData: {
      arranger: 'Eberhard Kraus, nach dem Orgelbuch „Lob Gottes“',
      composer: 'Franz Gruber (+ 1863)',
      lyricist: 'Josef Mohr (1792-1848)',
      musescore: 5642007,
      title: 'Stille Nacht'
    },
    songID: 'Stille-Nacht',
    slidesCount: 3
  },
  'Swing-low': {
    abc: 's',
    folder: '/tmp/s/Swing-low',
    metaData: {
      genre: 'Spiritual',
      title: 'Swing low'
    },
    songID: 'Swing-low',
    slidesCount: 5
  },
  'Zum-Tanze-da-geht-ein-Maedel': {
    abc: 'z',
    folder: '/tmp/z/Zum-Tanze-da-geht-ein-Maedel',
    metaData: {
      country: 'Schweden',
      musescore: 5641095,
      title: 'Zum Tanze, da geht ein Mädel'
    },
    songID: 'Zum-Tanze-da-geht-ein-Maedel',
    slidesCount: 2
  }
}

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

      it('get musescoreURL', function () {
        const song = new SongMetaDataCombined({
          musescore: 1234
        })
        assert.strictEqual(
          song.musescoreURL,
          'https://musescore.com/score/1234'
        )
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

      it('get wikidataURL', function () {
        const song = new SongMetaDataCombined({
          wikidata: 42
        })
        assert.strictEqual(
          song.wikidataURL,
          'https://www.wikidata.org/wiki/Q42'
        )
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

    describe('Class “CoreLibrary()”', function () {
      let library

      beforeEach(function () {
        library = new CoreLibrary(songs)
      })

      it('Exceptions', function () {
        const basePath = path.join(__dirname, 'songs', 'processed')
        assert.throws(
          function () {
            return new Library(basePath)
          },
          /^.*A song with the same songID already exists: Auf-der-Mauer$/
        )
      })

      describe('Properties', function () {
        it('Property “songs”', function () {
          assert.strictEqual(library.songs['Auf-der-Mauer'].songID, 'Auf-der-Mauer')
        })

        it('Property “songIDs”', function () {
          assert.deepStrictEqual(library.songIDs, [
            'Auf-der-Mauer',
            'Stille-Nacht',
            'Swing-low',
            'Zum-Tanze-da-geht-ein-Maedel'
          ])
        })
        it('Property “currentSongIndex”', function () {
          assert.strictEqual(library.currentSongIndex, 0)
        })
      })

      describe('Methods', function () {
        it('Method “toArray()”', function () {
          const songs = library.toArray()
          assert.strictEqual(songs.length, 4)
        })

        it('Method “toDynamicSelect()”', function () {
          const songs = library.toDynamicSelect()
          assert.strictEqual(songs.length, 4)
          assert.strictEqual(songs[0].id, 'Auf-der-Mauer')
          assert.strictEqual(songs[0].name, 'Auf der Mauer, auf der Lauer')
        })

        it('Method “countSongs()”', function () {
          assert.strictEqual(library.countSongs(), 4)
        })

        it('Method “updateCurrentSongIndex()”', function () {
          assert.strictEqual(library.updateCurrentSongIndex('Auf-der-Mauer'), 0)
        })

        describe('Method “getSongById()”', function () {
          it('No exception', function () {
            assert.strictEqual(library.getSongById('Auf-der-Mauer').metaData.title, 'Auf der Mauer, auf der Lauer')
          })

          it('Exception', function () {
            assert.throws(
              function () {
                return library.getSongById('test')
              },
              /^.*There is no song with the songID: test$/
            )
          })
        })

        it('Method “getPreviousSong()”', function () {
          assert.strictEqual(library.getPreviousSong().songID, 'Zum-Tanze-da-geht-ein-Maedel')
          assert.strictEqual(library.getPreviousSong().songID, 'Swing-low')
          assert.strictEqual(library.getPreviousSong().songID, 'Stille-Nacht')
          assert.strictEqual(library.getPreviousSong().songID, 'Auf-der-Mauer')
          assert.strictEqual(library.getPreviousSong().songID, 'Zum-Tanze-da-geht-ein-Maedel')
        })

        it('Method “getNextSong()”', function () {
          assert.strictEqual(library.getNextSong().songID, 'Stille-Nacht')
          assert.strictEqual(library.getNextSong().songID, 'Swing-low')
          assert.strictEqual(library.getNextSong().songID, 'Zum-Tanze-da-geht-ein-Maedel')
          assert.strictEqual(library.getNextSong().songID, 'Auf-der-Mauer')
          assert.strictEqual(library.getNextSong().songID, 'Stille-Nacht')
        })

        it('Method “getRandomSong()”', function () {
          assert.ok(library.getRandomSong().songID)
        })

        it('Method “toJSON()”', function () {
          const libraryJSON = JSON.parse(JSON.stringify(library))
          assert.strictEqual(libraryJSON['Stille-Nacht'].metaData.title, 'Stille Nacht')
        })
      })
    })
  })
})
