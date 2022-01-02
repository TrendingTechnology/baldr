const assert = require('assert')
const fs = require('fs-extra')
const baseRewired = require('rewire')('@bldr/songbook-base')
const path = require('path')
const process = require('process')
const sinon = require('sinon')
const {
  mkTmpDir,
  removeANSI
} = require('./_helper.js')

process.env.PATH = path.join(__dirname, 'bin:', process.env.PATH)
process.env.BALDR_SONGBOOK_PATH = path.resolve('test', 'songs', 'clean', 'some')

describe('Package “@bldr/songbook-base”', function () {
  describe('Functions', function () {
    describe('Function “checkExecutable()”', function () {
      let checkExecutable = baseRewired.__get__('checkExecutable')

      it('Function “checkExecutable()”: existing executable', function () {
        assert.strictEqual(checkExecutable('echo'), true)
      })

      it('Function “checkExecutable()”: nonexisting executable', function () {
        assert.strictEqual(checkExecutable('loooooool'), false)
      })
    })

    describe('Function “checkExecutables()”', function () {
      let checkExecutables = baseRewired.__get__('checkExecutables')

      it('all are existing', function () {
        let { status, unavailable } = checkExecutables(['echo', 'ls'])
        assert.strictEqual(status, true)
        assert.deepStrictEqual(unavailable, [])
      })

      it('one executable', function () {
        let { status, unavailable } = checkExecutables(['echo'])
        assert.strictEqual(status, true)
        assert.deepStrictEqual(unavailable, [])
      })

      it('one nonexisting executable', function () {
        let { status, unavailable } = checkExecutables(['echo', 'loooooool'])
        assert.strictEqual(status, false)
        assert.deepStrictEqual(unavailable, ['loooooool'])
      })

      it('two nonexisting executable', function () {
        let { status, unavailable } = checkExecutables(['troooooool', 'loooooool'])
        assert.strictEqual(status, false)
        assert.deepStrictEqual(unavailable, ['troooooool', 'loooooool'])
      })

      it('without arguments', function () {
        let { status, unavailable } = checkExecutables()
        assert.strictEqual(status, true)
        assert.deepStrictEqual(unavailable, [])
      })
    })

    describe('Function “bootstrapConfig()”', function () {
      beforeEach(function () {
        process.env.BALDR_SONGBOOK_PATH = path.resolve(__dirname, 'songs', 'clean', 'some')
      })

      it('config.path', function () {
        let bootstrapConfig = baseRewired.__get__('bootstrapConfig')
        let config = bootstrapConfig()
        assert.strictEqual(config.path, path.resolve('test', 'songs', 'clean', 'some'))
      })

      it('exit', function () {
        let savePATH = process.env.PATH
        process.env.PATH = ''
        try {
          let bootstrapConfig = baseRewired.__get__('bootstrapConfig')
          bootstrapConfig()
        } catch (e) {
          assert.strictEqual(
            e.message,
            'Some dependencies are not installed: “mscore-to-eps.sh”, ' +
            '“pdf2svg”, “pdfcrop”, “pdfinfo”, “pdftops”, “mscore”'
          )
          assert.strictEqual(e.name, 'UnavailableCommandsError')
        }
        process.env.PATH = savePATH
      })
    })

    it('Function “parseSongIDList()”', function () {
      let parseSongIDList = baseRewired.__get__('parseSongIDList')
      let result = parseSongIDList(path.join('test', 'files', 'song-id-list.txt'))
      assert.deepStrictEqual(result, ['Auf-der-Mauer', 'Swing-low'])
    })
  })

  describe('Classes', function () {
    describe('Class “Message()”', function () {
      let Message = baseRewired.__get__('Message')
      let message = baseRewired.__get__('message')
      let Song = baseRewired.__get__('Song')
      let song = new Song(path.resolve('test', 'songs', 'processed', 'some', 'a', 'Auf-der-Mauer'))

      const status = {
        'changed': {
          'piano': false,
          'slides': false
        },
        'folder': 'songs/a/Auf-der-Mauer',
        'folderName': 'Auf-der-Mauer',
        'force': false,
        'generated': {}
      }

      let clone = function (object) {
        return JSON.parse(JSON.stringify(object))
      }

      let assertSongFolder = function (status, output) {
        let stub = sinon.stub()
        let message = new Message()
        message.print = stub
        message.songFolder(status, song)
        assert.strictEqual(removeANSI(String(stub.args[0])), removeANSI(String(output)))
      }

      describe('Properties', function () {
        it('const “error”', function () {
          assert.strictEqual(removeANSI(message.error), removeANSI('\u001b[31m☒\u001b[39m'))
        })

        it('const “finished”', function () {
          assert.strictEqual(removeANSI(message.finished), removeANSI('\u001b[32m☑\u001b[39m'))
        })

        it('const “progress”', function () {
          assert.strictEqual(removeANSI(message.progress), removeANSI('\u001b[33m☐\u001b[39m'))
        })
      })

      describe('Methods', function () {
        it('Method “print()”', function () {
          let stub = sinon.stub()
          let message = new Message()
          message.print = stub
          message.print('lol')
          assert.strictEqual(stub.called, true)
        })

        it('Method “noConfigPath()”', function () {
          let stub = sinon.stub()
          let message = new Message()
          message.print = stub

          try {
            message.noConfigPath()
          } catch (e) {
            assert.strictEqual(e.message, 'No configuration file found.')
          }
          assert.strictEqual(stub.called, true)
          assert.strictEqual(removeANSI(stub.args[0][0]),
            removeANSI('\u001b[31m☒\u001b[39m  Configuration file “~/.baldr.json” not found!\nCreate such a config file or use the “--base-path” option!\n\nExample configuration file:\n{\n\t"songbook": {\n\t\t"path": "/home/jf/songs"\n\t}\n}\n')
          )
        })

        describe('Method “songFolder()”', function () {
          it('finished', function () {
            let finished = clone(status)
            assertSongFolder(
              finished,
              '\u001b[32m☑\u001b[39m  \u001b[32mAuf-der-Mauer\u001b[39m: Auf der Mauer, auf der Lauer'
            )
          })

          it('progress', function () {
            let progress = clone(status)
            progress.changed.slides = true
            assertSongFolder(
              progress,
              '\u001b[33m☐\u001b[39m  \u001b[33mAuf-der-Mauer\u001b[39m: Auf der Mauer, auf der Lauer'
            )
          })

          it('forced', function () {
            let forced = clone(status)
            forced.generated =
              {
                'piano': [
                  'piano_1.eps',
                  'piano_2.eps'
                ],
                'projector': 'projector.pdf',
                'slides': [
                  '01.svg',
                  '02.svg'
                ]
              }
            forced.force = true
            assertSongFolder(
              forced,
              '\u001b[32m☑\u001b[39m  \u001b[32mAuf-der-Mauer\u001b[39m: Auf der Mauer, auf der Lauer \u001b[31m(forced)\u001b[39m\n\t\u001b[33mslides\u001b[39m: 01.svg, 02.svg\n\t\u001b[33mpiano\u001b[39m: piano_1.eps, piano_2.eps'
            )
          })

          it('generatedPiano', function () {
            let generatedPiano = clone(status)
            generatedPiano.changed.piano = true
            generatedPiano.generated =
              {
                'piano': [
                  'piano_1.eps',
                  'piano_2.eps'
                ]
              }
            assertSongFolder(
              generatedPiano,
              '\u001b[33m☐\u001b[39m  \u001b[33mAuf-der-Mauer\u001b[39m: Auf der Mauer, auf der Lauer\n\t\u001b[33mpiano\u001b[39m: piano_1.eps, piano_2.eps'
            )
          })

          it('generatedSlides', function () {
            let generatedSlides = clone(status)
            generatedSlides.changed.slides = true
            generatedSlides.generated =
              {
                'projector': 'projector.pdf',
                'slides': [
                  '01.svg',
                  '02.svg'
                ]
              }
            assertSongFolder(
              generatedSlides,
              '\u001b[33m☐\u001b[39m  \u001b[33mAuf-der-Mauer\u001b[39m: Auf der Mauer, auf der Lauer\n\t\u001b[33mslides\u001b[39m: 01.svg, 02.svg'
            )
          })
        })
      })
    })

    describe('Class “Folder()”', function () {
      let Folder = baseRewired.__get__('Folder')

      describe('Initialisation', function () {
        it('Using one path string.', function () {
          let tmpDir = mkTmpDir()
          let folder = new Folder(tmpDir)
          assert.strictEqual(folder.folderPath, tmpDir)
        })

        it('Using two arguments', function () {
          let tmpDir = mkTmpDir()
          let folder = new Folder(tmpDir, 'test')
          assert.strictEqual(folder.folderPath, path.join(tmpDir, 'test'))
        })
      })

      it('Property “folderPath”', function () {
        let tmpDir = mkTmpDir()
        let folder = new Folder(tmpDir)
        assert.strictEqual(folder.folderPath, tmpDir)
      })

      describe('Methods', function () {
        it('Method “get()”', function () {
          let tmpDir = mkTmpDir()
          let folder = new Folder(tmpDir)
          assert.strictEqual(folder.get(), tmpDir)
        })

        it('Method “empty()”', function () {
          let tmpDir = mkTmpDir()
          let folder = new Folder(tmpDir)
          folder.empty()
          assert.ok(fs.existsSync(folder.folderPath))
        })

        it('Method “remove()”', function () {
          let tmpDir = mkTmpDir()
          let folder = new Folder(tmpDir)
          folder.remove()
          assert.ok(!fs.existsSync(folder.folderPath))
        })
      })
    })

    describe('Class “SongMetaData()”', function () {
      let songPath = path.resolve('test', 'songs', 'clean', 'some', 'a', 'Auf-der-Mauer')
      let SongMetaData = baseRewired.__get__('SongMetaData')
      let song = new SongMetaData(songPath)

      describe('Properties', function () {
        it('Property “alias”', function () {
          assert.strictEqual(song.alias, null)
        })

        it('Property “arranger”', function () {
          assert.strictEqual(song.arranger, null)
        })

        it('Property “artist”', function () {
          assert.strictEqual(song.artist, null)
        })

        it('Property “composer”', function () {
          assert.strictEqual(song.composer, null)
        })

        it('Property “country”', function () {
          assert.strictEqual(song.country, 'Deutschland')
        })

        it('Property “genre”', function () {
          assert.strictEqual(song.genre, null)
        })

        it('Property “lyricist”', function () {
          assert.strictEqual(song.lyricist, null)
        })

        it('Property “musescore”', function () {
          assert.strictEqual(song.musescore, null)
        })

        it('Property “source”', function () {
          assert.strictEqual(song.source, null)
        })

        it('Property “subtitle”', function () {
          assert.strictEqual(song.subtitle, null)
        })

        it('Property “title”', function () {
          assert.strictEqual(song.title, 'Auf der Mauer, auf der Lauer')
        })

        it('Property “year”', function () {
          assert.strictEqual(song.year, null)
        })

        it('Property “yamlFile”', function () {
          assert.strictEqual(song.yamlFile, 'info.yml')
        })

        it('Property “allowedProperties”', function () {
          assert.deepStrictEqual(song.allowedProperties, [
            'alias',
            'arranger',
            'artist',
            'composer',
            'country',
            'genre',
            'lyricist',
            'musescore',
            'source',
            'subtitle',
            'title',
            'year'
          ])
        })

        it('Property “folder”', function () {
          assert.ok(song.folder.includes('Mauer'))
        })
      })

      describe('Exceptions', function () {
        it('Exception: No song folder', function () {
          assert.throws(
            function () {
              return new SongMetaData('lol')
            },
            /^.*Song folder doesn’t exist: lol.*$/
          )
        })

        it('Exception: No yaml file', function () {
          let tmpDir = mkTmpDir()
          assert.throws(
            function () {
              return new SongMetaData(tmpDir)
            },
            /^.*YAML file could not be found: .*$/
          )
        })

        it('Exception: Unsupported key', function () {
          assert.throws(
            function () {
              return new SongMetaData(path.join('test', 'files', 'wrong-song-yaml'))
            },
            /^.*Unsupported key: lol.*$/
          )
        })
      })

      it('on regular song folder', function () {
        let song = new SongMetaData(songPath)
        assert.strictEqual(song.title, 'Auf der Mauer, auf der Lauer')
      })
    })

    describe('Class “SongMetaDataCombined()”', function () {
      let SongMetaDataCombined = baseRewired.__get__('SongMetaDataCombined')

      describe('get title', function () {
        it('title only', function () {
          let song = new SongMetaDataCombined({ 'title': 'lol' })
          assert.strictEqual(song.title, 'lol')
        })
        it('title and year', function () {
          let song = new SongMetaDataCombined({ 'title': 'lol', 'year': 1984 })
          assert.strictEqual(song.title, 'lol (1984)')
        })
      })

      describe('get subtitle', function () {
        it('all properties', function () {
          let song = new SongMetaDataCombined({ 'subtitle': 's', 'alias': 'a', 'country': 'c' })
          assert.strictEqual(song.subtitle, 's - a - c')
        })
        it('no properties', function () {
          let song = new SongMetaDataCombined({})
          assert.strictEqual(song.subtitle, '')
        })
      })

      describe('get composer', function () {
        it('all properties', function () {
          let song = new SongMetaDataCombined({ 'composer': 'c', 'artist': 'a', 'genre': 'g' })
          assert.strictEqual(song.composer, 'c, a, g')
        })

        it('artist and composer are identical', function () {
          let song = new SongMetaDataCombined({ 'composer': 'i', 'artist': 'i', 'genre': 'g' })
          assert.strictEqual(song.composer, 'i, g')
        })

        it('no properties', function () {
          let song = new SongMetaDataCombined({})
          assert.strictEqual(song.composer, '')
        })
      })

      describe('get lyricist', function () {
        it('all properties', function () {
          let song = new SongMetaDataCombined({ 'lyricist': 'l' })
          assert.strictEqual(song.lyricist, 'l')
        })

        it('lyricist and composer are identical', function () {
          let song = new SongMetaDataCombined({ 'lyricist': 'i', 'composer': 'i' })
          assert.strictEqual(song.lyricist, '')
        })

        it('lyricist and artist are identical', function () {
          let song = new SongMetaDataCombined({ 'lyricist': 'i', 'artist': 'i' })
          assert.strictEqual(song.lyricist, '')
        })

        it('no properties', function () {
          let song = new SongMetaDataCombined({})
          assert.strictEqual(song.lyricist, '')
        })
      })
      describe('Real world example', function () {
        let SongMetaData = baseRewired.__get__('SongMetaData')
        let folder = path.join('test', 'songs', 'clean', 'some', 'a', 'Auf-der-Mauer')
        let metaData = new SongMetaData(folder)
        let combined = new SongMetaDataCombined(metaData)
        it('title', function () {
          assert.strictEqual(combined.title, 'Auf der Mauer, auf der Lauer')
        })
        it('subtitle', function () {
          assert.strictEqual(combined.subtitle, 'Deutschland')
        })
        it('composer', function () {
          assert.strictEqual(combined.composer, '')
        })
        it('lyricist', function () {
          assert.strictEqual(combined.lyricist, '')
        })
      })
    })

    describe('Class “Song()”', function () {
      let Song = baseRewired.__get__('Song')
      let folder = path.join('test', 'songs', 'clean', 'some', 'a', 'Auf-der-Mauer')
      let song = new Song(folder)

      describe('Initialisation', function () {
        it('with a directory', function () {
          let song = new Song(folder)
          assert.strictEqual(song.folder, folder)
        })

        it('with info.yml', function () {
          let song = new Song(path.join(folder, 'info.yml'))
          assert.strictEqual(song.folder, folder)
        })

        it('with projector.mscx', function () {
          let song = new Song(path.join(folder, 'projector.mscx'))
          assert.strictEqual(song.folder, folder)
        })
      })

      describe('Properties', function () {
        it('Property “folder”', function () {
          assert.strictEqual(song.folder, folder)
        })

        it('Property “abc”', function () {
          assert.strictEqual(song.abc, 'a')
        })

        it('Property “songID”', function () {
          assert.strictEqual(song.songID, 'Auf-der-Mauer')
        })

        it('Property “metaData”', function () {
          let SongMetaData = baseRewired.__get__('SongMetaData')
          assert.ok(song.metaData instanceof SongMetaData)
        })

        it('Property “metaDataCombined”', function () {
          let SongMetaDataCombined = baseRewired.__get__('SongMetaDataCombined')
          assert.ok(song.metaDataCombined instanceof SongMetaDataCombined)
        })

        it('Property “folderSlides”', function () {
          let Folder = baseRewired.__get__('Folder')
          assert.ok(song.folderSlides instanceof Folder)
        })

        it('Property “folderPiano”', function () {
          let Folder = baseRewired.__get__('Folder')
          assert.ok(song.folderPiano instanceof Folder)
        })

        it('Property “mscxProjector”', function () {
          assert.strictEqual(song.mscxProjector, path.join(song.folder, 'projector.mscx'))
        })

        it('Property “mscxPiano”', function () {
          assert.strictEqual(song.mscxPiano, path.join(song.folder, 'piano.mscx'))
        })

        describe('Property “pianoFiles”', function () {
          it('empty', function () {
            let song = new Song(path.join('test', 'songs', 'clean', 'some', 's', 'Swing-low'))
            assert.deepStrictEqual(song.pianoFiles, [])
          })

          it('not empty', function () {
            let song = new Song(path.join('test', 'songs', 'processed', 'some', 's', 'Swing-low'))
            assert.deepStrictEqual(song.pianoFiles, ['piano_1.eps', 'piano_2.eps', 'piano_3.eps'])
          })
        })

        describe('Property “slidesFiles”', function () {
          it('empty', function () {
            let song = new Song(path.join('test', 'songs', 'clean', 'some', 's', 'Swing-low'))
            assert.deepStrictEqual(song.slidesFiles, [])
          })

          it('not empty', function () {
            let song = new Song(path.join('test', 'songs', 'processed', 'some', 's', 'Swing-low'))
            assert.deepStrictEqual(song.slidesFiles, ['01.svg', '02.svg', '03.svg'])
          })
        })
      })

      describe('Methods', function () {
        describe('Method “normalizeSongFolder_()”', function () {
          it('folder”', function () {
            assert.strictEqual(song.normalizeSongFolder_(folder), folder)
          })

          it('file', function () {
            assert.strictEqual(song.normalizeSongFolder_(path.join(folder, 'info.yml')), folder)
          })
        })

        it('Method “recognizeABCFolder_(): file', function () {
          assert.strictEqual(song.recognizeABCFolder_(folder), 'a')
        })

        describe('Method “detectFile_()”', function () {
          it('Exception', function () {
            assert.throws(
              function () {
                song.detectFile_('xxx')
              },
              /^.*File doesn’t exist: .*$/
            )
          })

          it('Exception by two files', function () {
            assert.throws(
              function () {
                song.detectFile_('xxx', 'yyy')
              },
              /^.*File doesn’t exist: .*$/
            )
          })

          it('Return value', function () {
            let result = song.detectFile_('projector.mscx')
            assert.ok(result.includes('projector.mscx'))
          })

          it('Return value by two files', function () {
            let result = song.detectFile_('xxx.mscx', 'projector.mscx')
            assert.ok(result.includes('projector.mscx'))
          })

          it('Return value by two files, get first', function () {
            let result = song.detectFile_('projector.mscx', 'xxx.mscx')
            assert.ok(result.includes('projector.mscx'))
          })
        })

        describe('Method “getFolderFiles_()”', function () {
          let folder = path.join('test', 'songs', 'processed', 'one', 'a', 'Auf-der-Mauer')
          let song = new Song(folder)

          it('Method “getFolderFiles_()”: eps', function () {
            const files = song.getFolderFiles_('piano', '.eps')
            assert.deepStrictEqual(files, ['piano.eps'])
          })

          it('Method “getFolderFiles_()”: svg', function () {
            const files = song.getFolderFiles_('slides', '.svg')
            assert.deepStrictEqual(files, ['01.svg'])
          })

          it('Method “getFolderFiles_()”: non existent folder', function () {
            const files = song.getFolderFiles_('lol', '.svg')
            assert.deepStrictEqual(files, [])
          })

          it('Method “getFolderFiles_()”: empty folder', function () {
            const empty = path.join('test', 'files', 'empty')
            fs.mkdirSync(empty)
            const files = song.getFolderFiles_('empty', '.svg')
            assert.deepStrictEqual(files, [])
            fs.rmdirSync(empty)
          })
        })
      })
    })

    describe('Class “AlphabeticalSongsTree()”', function () {
      let AlphabeticalSongsTree = baseRewired.__get__('AlphabeticalSongsTree')
      let Library = baseRewired.__get__('Library')
      let library = new Library(path.join('test', 'songs', 'processed', 'some'))
      let songs = Object.values(library.songs)

      it('Initialisation', function () {
        let abcTree = new AlphabeticalSongsTree(songs)
        assert.strictEqual(abcTree.a[0].metaData.title, 'Auf der Mauer, auf der Lauer')
        assert.strictEqual(abcTree.s[0].metaData.title, 'Stille Nacht')
      })
    })

    describe('Class “Library()”', function () {
      let Library = baseRewired.__get__('Library')
      let library
      let basePath

      beforeEach(function () {
        basePath = mkTmpDir()
        fs.copySync(path.join('test', 'songs', 'processed', 'some'), basePath)
        library = new Library(basePath)
      })

      it('Exceptions', function () {
        let basePath = path.join('test', 'songs', 'processed')
        assert.throws(
          function () {
            return new Library(basePath)
          },
          /^.*A song with the same songID already exists: Auf-der-Mauer$/
        )
      })

      describe('Properties', function () {
        it('Property “basePath”', function () {
          assert.strictEqual(library.basePath, basePath)
        })

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
          let songs = library.toArray()
          assert.strictEqual(songs.length, 4)
        })

        it('Method “countSongs()”', function () {
          assert.strictEqual(library.countSongs(), 4)
        })

        it('Method “updateCurrentSongIndex()”', function () {
          assert.strictEqual(library.updateCurrentSongIndex('Auf-der-Mauer'), 0)
        })

        it('Method “detectSongs_()”', function () {
          assert.strictEqual(library.detectSongs_().length, 4)
        })

        it('Method “collectSongs_()”', function () {
          assert.strictEqual(library.detectSongs_().length, 4)
          let songs = library.collectSongs_()
          assert.strictEqual(songs['Auf-der-Mauer'].songID, 'Auf-der-Mauer')
        })

        it('Method “loadSongList()”', function () {
          let result = library.loadSongList(path.join('test', 'files', 'song-id-list.txt'))
          assert.deepStrictEqual(result, library.songs)
          assert.strictEqual(Object.keys(result).length, 2)
        })

        it('Method “gitPull()”', function () {
          assert.ok(!library.gitPull())
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

        it('Method “getABCFolders_()”', function () {
          let folders = library.getABCFolders_()
          assert.strictEqual(folders.length, 3)
          assert.deepStrictEqual(folders, ['a', 's', 'z'])
        })
      })
    })
  })
})
