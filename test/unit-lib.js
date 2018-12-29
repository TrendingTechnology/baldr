const assert = require('assert')
const fs = require('fs-extra')
const libRewired = require('rewire')('../src/lib.js')
const path = require('path')
const process = require('process')
const sinon = require('sinon')
const {
  assertExists,
  assertNotExists,
  fakeSongs,
  mkTmpDir,
  mkTmpFile,
  readPathSegments,
  removeANSI,
  tmpCopy
} = require('./_helper.js')

process.env.PATH = path.join(__dirname, 'bin:', process.env.PATH)
process.env.BALDR_SONGBOOK_PATH = path.resolve('test', 'songs', 'clean', 'some')

describe('Functions', function () {
  describe('Function “checkExecutable()”', function () {
    let checkExecutable = libRewired.__get__('checkExecutable')

    it('Function “checkExecutable()”: existing executable', function () {
      assert.strictEqual(checkExecutable('echo'), true)
    })

    it('Function “checkExecutable()”: nonexisting executable', function () {
      assert.strictEqual(checkExecutable('loooooool'), false)
    })
  })

  describe('Function “checkExecutables()”', function () {
    let checkExecutables = libRewired.__get__('checkExecutables')

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
      let bootstrapConfig = libRewired.__get__('bootstrapConfig')
      let config = bootstrapConfig()
      assert.strictEqual(config.path, path.resolve('test', 'songs', 'clean', 'some'))
    })

    it('exit', function () {
      let savePATH = process.env.PATH
      process.env.PATH = ''
      try {
        let bootstrapConfig = libRewired.__get__('bootstrapConfig')
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
    let parseSongIDList = libRewired.__get__('parseSongIDList')
    let result = parseSongIDList(path.join('test', 'files', 'song-id-list.txt'))
    assert.deepStrictEqual(result, ['Auf-der-Mauer', 'Swing-low'])
  })
})

describe('Classes', function () {
  describe('Class “Message()”', function () {
    let Message = libRewired.__get__('Message')
    let message = libRewired.__get__('message')
    let Song = libRewired.__get__('Song')
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

  describe('Class “TextFile()”', function () {
    let TextFile = libRewired.__get__('TextFile')

    it('Property “path”', function () {
      let tmpFile = mkTmpFile()
      let texFile = new TextFile(tmpFile)
      assert.strictEqual(texFile.path, tmpFile)
    })

    describe('Methods', function () {
      it('Method “append()”', function () {
        let texFile = new TextFile(mkTmpFile())
        texFile.append('test')
      })

      it('Method “read()”', function () {
        let texFile = new TextFile(mkTmpFile())
        texFile.append('test')
        assert.strictEqual(texFile.read(), 'test')
      })

      it('Method “flush()”', function () {
        let texFile = new TextFile(mkTmpFile())
        texFile.append('test')
        texFile.flush('test')
        assert.strictEqual(texFile.read(), '')
      })
      it('Method “remove()”', function () {
        let texFile = new TextFile(mkTmpFile())
        assertExists(texFile.path)
        texFile.remove()
        assertNotExists(texFile.path)
      })
    })
  })

  describe('Class “Folder()”', function () {
    let Folder = libRewired.__get__('Folder')

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

  describe('Class “Sqlite()”', function () {
    let Sqlite = libRewired.__get__('Sqlite')
    let tmpDir = mkTmpDir()
    let testDb = path.join(tmpDir, 'test.db')
    let db

    beforeEach(function () {
      db = new Sqlite(testDb)
    })

    afterEach(function () {
      fs.unlinkSync(testDb)
    })

    describe('Initialisation', function () {
      it('Object “Sqlite()”', function () {
        assert.ok(db)
      })

      it('test.db exists', function () {
        assertExists(testDb)
      })
    })

    describe('Properties', function () {
      it('Property “dbFile”', function () {
        assert.strictEqual(db.dbFile, testDb)
      })

      it('Property “db”', function () {
        const Sqlite3 = require('better-sqlite3')
        assert.ok(db.db instanceof Sqlite3)
      })
    })

    describe('Methods', function () {
      describe('Method “insert()”', function () {
        it('Successful insert', function () {
          db.insert('lol', 'toll')
          let row = db.select('lol')
          assert.strictEqual(row.hash, 'toll')
        })

        it('Exception', function () {
          try {
            db.insert('lol', 'toll')
            db.insert('lol', 'toll')
          } catch (e) {
            assert.strictEqual(e.name, 'SqliteError')
          }
        })
      })

      it('Method “update()”', function () {
        db.insert('lol', 'toll')
        db.update('lol', 'troll')
        assert.strictEqual(db.select('lol').hash, 'troll')
      })
    })
  })

  describe('Class “FileMonitor()”', function () {
    let FileMonitor = libRewired.__get__('FileMonitor')
    let tmpDir = mkTmpDir()
    let testDb = path.join(tmpDir, 'file-monitor.db')
    let testFile = path.join(tmpDir, 'file-monitor.txt')
    let monitor

    beforeEach(function () {
      monitor = new FileMonitor(testDb)
    })

    afterEach(function () {
      if (fs.existsSync(testFile)) fs.unlinkSync(testFile)
      monitor.purge()
    })

    it('dbFile exists', function () {
      assert.strictEqual(monitor.db.dbFile, testDb)
    })

    it('File modified', function () {
      fs.appendFileSync(testFile, 'test')
      assert.ok(monitor.isModified(testFile))
    })

    it('File not modified', function () {
      fs.appendFileSync(testFile, 'test')
      assert.ok(monitor.isModified(testFile))
      assert.ok(!monitor.isModified(testFile))
      assert.ok(!monitor.isModified(testFile))
    })

    it('File twice modified', function () {
      fs.appendFileSync(testFile, 'test')
      assert.ok(monitor.isModified(testFile))
      fs.appendFileSync(testFile, 'test')
      assert.ok(monitor.isModified(testFile))
    })

    describe('Methods', function () {
      it('Method “hashSHA1()”', function () {
        assert.strictEqual(
          monitor.hashSHA1(path.join('test', 'files', 'hash.txt')),
          '7516f3c75e85c64b98241a12230d62a64e59bce3'
        )
      })

      it('Method “purge()”', function () {
        monitor.purge()
        assert.ok(!fs.existsSync(testDb))
      })

      it('Method “purge()”: call multiple times', function () {
        monitor.purge()
        assert.ok(!fs.existsSync(testDb))
        monitor.purge()
        assert.ok(!fs.existsSync(testDb))
      })
    })
  })

  describe('Class “SongMetaData()”', function () {
    let songPath = path.resolve('test', 'songs', 'clean', 'some', 'a', 'Auf-der-Mauer')
    let SongMetaData = libRewired.__get__('SongMetaData')
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
    let SongMetaDataCombined = libRewired.__get__('SongMetaDataCombined')

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
      let SongMetaData = libRewired.__get__('SongMetaData')
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
    let Song = libRewired.__get__('Song')
    let FileMonitor = libRewired.__get__('FileMonitor')
    let fileMonitor = new FileMonitor(mkTmpFile())
    let folder = path.join('test', 'songs', 'clean', 'some', 'a', 'Auf-der-Mauer')
    let song = new Song(folder, fileMonitor)

    afterEach(function () {
      fileMonitor.flush()
    })

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

      it('Property “fileMonitor”', function () {
        assert.ok(song.fileMonitor instanceof FileMonitor)
      })

      it('Property “abc”', function () {
        assert.strictEqual(song.abc, 'a')
      })

      it('Property “songID”', function () {
        assert.strictEqual(song.songID, 'Auf-der-Mauer')
      })

      it('Property “metaData”', function () {
        let SongMetaData = libRewired.__get__('SongMetaData')
        assert.ok(song.metaData instanceof SongMetaData)
      })

      it('Property “metaDataCombined”', function () {
        let SongMetaDataCombined = libRewired.__get__('SongMetaDataCombined')
        assert.ok(song.metaDataCombined instanceof SongMetaDataCombined)
      })

      it('Property “folderSlides”', function () {
        let Folder = libRewired.__get__('Folder')
        assert.ok(song.folderSlides instanceof Folder)
      })

      it('Property “folderPiano”', function () {
        let Folder = libRewired.__get__('Folder')
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

      it('Method “formatPianoTeXEpsFile_()”', function () {
        let folder = path.join('test', 'songs', 'processed', 'some', 's', 'Swing-low')
        let song = new Song(folder)
        assert.strictEqual(
          song.formatPianoTeXEpsFile_(0),
          '\\tmpimage{s/Swing-low/piano/piano_1.eps}\n'
        )

        assert.strictEqual(
          song.formatPianoTeXEpsFile_(1),
          '\\tmpimage{s/Swing-low/piano/piano_2.eps}\n'
        )

        assert.strictEqual(
          song.formatPianoTeXEpsFile_(2),
          '\\tmpimage{s/Swing-low/piano/piano_3.eps}\n'
        )
      })

      describe('Method “formatPianoTex()”', function () {
        it('Markup', function () {
          let folder = path.join('test', 'songs', 'processed', 'some', 's', 'Swing-low')
          let song = new Song(folder)
          assert.strictEqual(
            song.formatPianoTex(),
            '\n' +
            '\\tmpheading{Swing low}\n' +
            '\\tmpimage{s/Swing-low/piano/piano_1.eps}\n' +
            '\\tmpimage{s/Swing-low/piano/piano_2.eps}\n' +
            '\\tmpimage{s/Swing-low/piano/piano_3.eps}\n'
          )
        })

        it('Exception: no EPS files', function () {
          let song = new Song(folder)
          song.pianoFiles = []
          assert.throws(
            function () {
              song.formatPianoTex()
            },
            /^.*The song “Auf der Mauer, auf der Lauer” has no EPS piano score files\..*$/
          )
        })

        it('Exception: more than 4 EPS files', function () {
          let song = new Song(folder)
          song.pianoFiles = [1, 2, 3, 4, 5]
          assert.throws(
            function () {
              song.formatPianoTex()
            },
            /^.*The song “Auf der Mauer, auf der Lauer” has more than 4 EPS piano score files\..*$/
          )
        })
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

      describe('Method “generateIntermediateFiles()”', function () {
        it('First run', function () {
          let status = song.generateIntermediateFiles('all', false)
          assert.deepStrictEqual(
            status,
            {
              'changed': {
                'piano': true,
                'slides': true
              },
              'folder': 'test/songs/clean/some/a/Auf-der-Mauer',
              'folderName': 'Auf-der-Mauer',
              'force': false,
              'generated': {
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
            }
          )
        })

        it('Second run', function () {
          song.generateIntermediateFiles('all', false)
          let status = song.generateIntermediateFiles('all', false)
          assert.strictEqual(status.changed.piano, false)
          assert.strictEqual(status.changed.slides, false)
        })

        it('force', function () {
          let status = song.generateIntermediateFiles('all', true)
          assert.strictEqual(status.force, true)
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

      it('Method “generatePDF_()”', function () {
        let file = song.generatePDF_('projector', 'projector')
        assert.strictEqual(file, 'projector.pdf')
        assertExists(folder, 'projector.pdf')
      })

      it('Method “generateSlides_()”', function () {
        song.generatePDF_('projector')
        const slides = path.join(folder, 'slides')
        let files = song.generateSlides_(folder)

        assert.deepStrictEqual(
          files,
          ['01.svg', '02.svg']
        );

        [
          [slides, '01.svg'],
          [slides, '02.svg']
        ].forEach(args => { assertExists(...args) })

        fs.removeSync(slides)
      })

      describe('Method “generatePiano_()”', function () {
        it('lead', function () {
          let folderSwing = path.join('test', 'songs', 'clean', 'some', 's', 'Swing-low')
          let songSwing = new Song(folderSwing, fileMonitor)
          let files = songSwing.generatePiano_()

          assert.deepStrictEqual(files, [ 'piano_1.eps', 'piano_2.eps' ])

          let result = [
            [folderSwing, 'piano'],
            [folderSwing, 'piano', 'piano.mscx'],
            [folderSwing, 'piano', 'piano_1.eps']
          ]
          result.forEach(args => { assertExists(...args) })

          fs.removeSync(path.join(folder, 'piano'))
        })

        it('piano', function () {
          let files = song.generatePiano_()

          assert.deepStrictEqual(
            files,
            ['piano_1.eps', 'piano_2.eps']
          )

          let result = [
            [folder, 'piano'],
            [folder, 'piano', 'piano.mscx'],
            [folder, 'piano', 'piano_1.eps']
          ]
          result.forEach(args => { assertExists(...args) })

          fs.removeSync(path.join(folder, 'piano'))
        })
      })

      it('Method “cleanIntermediateFiles()”', function () {
        song.generateIntermediateFiles('all', false)
        assert.ok(fs.existsSync(path.join(song.folder, 'projector.pdf')))
        song.cleanIntermediateFiles()
        assert.ok(!fs.existsSync(path.join(song.folder, 'projector.pdf')))
      })
    })
  })

  describe('Class “AlphabeticalSongsTree()”', function () {
    let AlphabeticalSongsTree = libRewired.__get__('AlphabeticalSongsTree')
    let Library = libRewired.__get__('Library')
    let library = new Library(path.join('test', 'songs', 'processed', 'some'))
    let songs = Object.values(library.songs)

    it('Initialisation', function () {
      let abcTree = new AlphabeticalSongsTree(songs)
      assert.strictEqual(abcTree.a[0].metaData.title, 'Auf der Mauer, auf der Lauer')
      assert.strictEqual(abcTree.s[0].metaData.title, 'Stille Nacht')
    })
  })

  describe('Class “PianoFilesCountTree()”', function () {
    let PianoFilesCountTree = libRewired.__get__('PianoFilesCountTree')
    let Library = libRewired.__get__('Library')
    let library = new Library(path.join('test', 'songs', 'processed', 'some'))
    let songs = Object.values(library.songs)
    let countTree = new PianoFilesCountTree(songs)

    it('Initialisation', function () {
      assert.ok(countTree)
      assert.strictEqual(countTree[3][0].metaData.title, 'Auf der Mauer, auf der Lauer')
      assert.strictEqual(countTree[1][0].metaData.title, 'Stille Nacht')
      assert.strictEqual(countTree[3][1].metaData.title, 'Swing low')
      assert.strictEqual(countTree[2][0].metaData.title, 'Zum Tanze, da geht ein Mädel')
    })

    describe('Method “sum()”', function () {
      it('Integration', function () {
        assert.strictEqual(countTree.sum(), 4)
      })

      it('one', function () {
        let countTree = new PianoFilesCountTree(fakeSongs({ 1: 1 }))
        assert.strictEqual(countTree.sum(), 1)
      })

      it('many', function () {
        let countTree = new PianoFilesCountTree(fakeSongs({ 1: 1, 2: 2, 3: 3, 4: 4 }))
        assert.strictEqual(countTree.sum(), 10)
      })

      it('empty', function () {
        let countTree = new PianoFilesCountTree([])
        assert.strictEqual(countTree.sum(), 0)
      })
    })

    describe('Method “isEmpty()”', function () {
      it('Integration', function () {
        assert.strictEqual(countTree.isEmpty(), false)
      })

      it('true', function () {
        let countTree = new PianoFilesCountTree([])
        assert.strictEqual(countTree.isEmpty(), true)
      })

      it('false', function () {
        let countTree = new PianoFilesCountTree(fakeSongs({ 1: 1 }))
        assert.strictEqual(countTree.isEmpty(), false)
      })
    })

    describe('Method “shift()”', function () {
      it('No exception', function () {
        let countTree = new PianoFilesCountTree(songs)
        let song1 = countTree.shift(1)
        assert.strictEqual(song1.metaData.title, 'Stille Nacht')
        let song2 = countTree.shift(1)
        assert.strictEqual(song2, undefined)
      })

      it('No songs anymore in count category', function () {
        let countTree = new PianoFilesCountTree(songs)
        assert.strictEqual(countTree.shift(4), undefined)
      })

      it('Exception', function () {
        assert.throws(
          function () {
            countTree.shift(7)
          },
          /^.*Invalid piano file count: 7$/
        )
      })
    })
  })

  describe('Class “PianoScore()”', function () {
    let PianoScore = libRewired.__get__('PianoScore')
    let PianoFilesCountTree = libRewired.__get__('PianoFilesCountTree')
    let Library = libRewired.__get__('Library')
    let tmpDir = tmpCopy('processed', 'some')
    let library = new Library(tmpDir)
    let songs = library.toArray()

    it('Initialisation', function () {
      let pianoScore = new PianoScore(path.join(tmpDir, 'piano.tex'), library)
      assert.ok(pianoScore)
    })

    describe('Methods', function () {
      describe('Static method “texCmd()”', function () {
        it('without a value', function () {
          assert.strictEqual(PianoScore.texCmd('lorem', 'ipsum'), '\\tmplorem{ipsum}\n')
        })

        it('with a value', function () {
          assert.strictEqual(PianoScore.texCmd('lorem'), '\\tmplorem\n')
        })
      })
      describe('Static method “selectSongs()”', function () {
        let fakeSelectSongs = function (pageCount, config) {
          let songs = fakeSongs(config)
          let countTree = new PianoFilesCountTree(songs)
          return PianoScore.selectSongs(countTree, [], pageCount)
        }

        it('4 pages per unit <- 1-page-song, 2-page-song x2, 3-page-song x3', function () {
          let result = fakeSelectSongs(4, { 1: 1, 2: 2, 3: 3 })
          assert.strictEqual(result.length, 2)
          assert.strictEqual(result[0].pianoFiles.length, '3')
          assert.strictEqual(result[1].pianoFiles.length, '1')
        })

        it('2 pages per unit <- 1-page-song x1', function () {
          let result = fakeSelectSongs(2, { 1: 1 })
          assert.strictEqual(result.length, 1)
          assert.strictEqual(result[0].pianoFiles.length, '1')
        })

        it('4 pages per unit <- 1-page-song x4', function () {
          let result = fakeSelectSongs(4, { 1: 4 })
          assert.strictEqual(result.length, 4)
          assert.strictEqual(result[0].pianoFiles.length, '1')
          assert.strictEqual(result[1].pianoFiles.length, '1')
          assert.strictEqual(result[2].pianoFiles.length, '1')
          assert.strictEqual(result[3].pianoFiles.length, '1')
        })

        it('4 pages per unit <- 4-page-song x2', function () {
          let result = fakeSelectSongs(4, { 4: 2 })
          assert.strictEqual(result.length, 1)
          assert.strictEqual(result[0].pianoFiles.length, '4')
        })

        it('2 pages per unit <- 2-page-song x2', function () {
          let result = fakeSelectSongs(2, { 2: 2 })
          assert.strictEqual(result.length, 1)
          assert.strictEqual(result[0].pianoFiles.length, '2')
        })

        it('2 pages per unit <- 2-page-song', function () {
          let result = fakeSelectSongs(2, { 2: 1 })
          assert.strictEqual(result.length, 1)
          assert.strictEqual(result[0].pianoFiles.length, '2')
        })

        it('4 pages per unit <- 1-page-song, 2-page-song, 4-page-song x2', function () {
          let result = fakeSelectSongs(4, { 1: 1, 2: 1, 4: 2 })
          assert.strictEqual(result.length, 1)
          assert.strictEqual(result[0].pianoFiles.length, '4')
        })

        it('2 pages per unit <- 3-page-song', function () {
          let result = fakeSelectSongs(2, { 3: 1 })
          assert.strictEqual(result.length, 0)
        })

        it('4 pages per unit <- 1-page-song x3, 2-page-song x3, 3-page-song x3', function () {
          let result = fakeSelectSongs(4, { 1: 3, 2: 3, 3: 3 })
          assert.strictEqual(result.length, 2)
          assert.strictEqual(result[0].pianoFiles.length, '3')
          assert.strictEqual(result[1].pianoFiles.length, '1')
        })
      })

      describe('Static method “buildSongList()”', function () {
        it('pageTurnOptimized = false', function () {
          let texMarkup = PianoScore.buildSongList(songs, false)
          assert.strictEqual(texMarkup, `
\\tmpheading{Auf der Mauer, auf der Lauer}
\\tmpimage{a/Auf-der-Mauer/piano/piano_1.eps}
\\tmpimage{a/Auf-der-Mauer/piano/piano_2.eps}
\\tmpimage{a/Auf-der-Mauer/piano/piano_3.eps}

\\tmpheading{Stille Nacht}
\\tmpimage{s/Stille-Nacht/piano/piano.eps}

\\tmpheading{Swing low}
\\tmpimage{s/Swing-low/piano/piano_1.eps}
\\tmpimage{s/Swing-low/piano/piano_2.eps}
\\tmpimage{s/Swing-low/piano/piano_3.eps}

\\tmpheading{Zum Tanze, da geht ein Mädel}
\\tmpimage{z/Zum-Tanze-da-geht-ein-Maedel/piano/piano_1.eps}
\\tmpimage{z/Zum-Tanze-da-geht-ein-Maedel/piano/piano_2.eps}
`)
        })

        it('pageTurnOptimized = true', function () {
          let texMarkup = PianoScore.buildSongList(songs, true)
          assert.strictEqual(texMarkup, `
\\tmpheading{Zum Tanze, da geht ein Mädel}
\\tmpimage{z/Zum-Tanze-da-geht-ein-Maedel/piano/piano_1.eps}
\\tmpimage{z/Zum-Tanze-da-geht-ein-Maedel/piano/piano_2.eps}

\\tmpheading{Auf der Mauer, auf der Lauer}
\\tmpimage{a/Auf-der-Mauer/piano/piano_1.eps}
\\tmpimage{a/Auf-der-Mauer/piano/piano_2.eps}
\\tmpimage{a/Auf-der-Mauer/piano/piano_3.eps}

\\tmpheading{Stille Nacht}
\\tmpimage{s/Stille-Nacht/piano/piano.eps}

\\tmpheading{Swing low}
\\tmpimage{s/Swing-low/piano/piano_1.eps}
\\tmpimage{s/Swing-low/piano/piano_2.eps}
\\tmpimage{s/Swing-low/piano/piano_3.eps}
\\tmpplaceholder
`)
        })
      })

      describe('Method “build()”', function () {
        it('groupAlphabetically = true, pageTurnOptimized = true', function () {
          let pianoScore = new PianoScore(mkTmpFile(), library, true, true)
          let texMarkup = pianoScore.build()
          assert.strictEqual(texMarkup, `

\\tmpchapter{A}
\\tmpplaceholder
\\tmpplaceholder

\\tmpheading{Auf der Mauer, auf der Lauer}
\\tmpimage{a/Auf-der-Mauer/piano/piano_1.eps}
\\tmpimage{a/Auf-der-Mauer/piano/piano_2.eps}
\\tmpimage{a/Auf-der-Mauer/piano/piano_3.eps}
\\tmpplaceholder


\\tmpchapter{S}

\\tmpheading{Stille Nacht}
\\tmpimage{s/Stille-Nacht/piano/piano.eps}
\\tmpplaceholder

\\tmpheading{Swing low}
\\tmpimage{s/Swing-low/piano/piano_1.eps}
\\tmpimage{s/Swing-low/piano/piano_2.eps}
\\tmpimage{s/Swing-low/piano/piano_3.eps}
\\tmpplaceholder


\\tmpchapter{Z}

\\tmpheading{Zum Tanze, da geht ein Mädel}
\\tmpimage{z/Zum-Tanze-da-geht-ein-Maedel/piano/piano_1.eps}
\\tmpimage{z/Zum-Tanze-da-geht-ein-Maedel/piano/piano_2.eps}
`)
        })

        it('groupAlphabetically = true, pageTurnOptimized = false', function () {
          let pianoScore = new PianoScore(mkTmpFile(), library, true, false)
          let texMarkup = pianoScore.build()
          assert.strictEqual(texMarkup, `

\\tmpchapter{A}

\\tmpheading{Auf der Mauer, auf der Lauer}
\\tmpimage{a/Auf-der-Mauer/piano/piano_1.eps}
\\tmpimage{a/Auf-der-Mauer/piano/piano_2.eps}
\\tmpimage{a/Auf-der-Mauer/piano/piano_3.eps}


\\tmpchapter{S}

\\tmpheading{Stille Nacht}
\\tmpimage{s/Stille-Nacht/piano/piano.eps}

\\tmpheading{Swing low}
\\tmpimage{s/Swing-low/piano/piano_1.eps}
\\tmpimage{s/Swing-low/piano/piano_2.eps}
\\tmpimage{s/Swing-low/piano/piano_3.eps}


\\tmpchapter{Z}

\\tmpheading{Zum Tanze, da geht ein Mädel}
\\tmpimage{z/Zum-Tanze-da-geht-ein-Maedel/piano/piano_1.eps}
\\tmpimage{z/Zum-Tanze-da-geht-ein-Maedel/piano/piano_2.eps}
`)
        })

        it('groupAlphabetically = false, pageTurnOptimized = true', function () {
          let pianoScore = new PianoScore(mkTmpFile(), library, false, true)
          let texMarkup = pianoScore.build()
          assert.strictEqual(texMarkup, `
\\tmpheading{Zum Tanze, da geht ein Mädel}
\\tmpimage{z/Zum-Tanze-da-geht-ein-Maedel/piano/piano_1.eps}
\\tmpimage{z/Zum-Tanze-da-geht-ein-Maedel/piano/piano_2.eps}

\\tmpheading{Auf der Mauer, auf der Lauer}
\\tmpimage{a/Auf-der-Mauer/piano/piano_1.eps}
\\tmpimage{a/Auf-der-Mauer/piano/piano_2.eps}
\\tmpimage{a/Auf-der-Mauer/piano/piano_3.eps}

\\tmpheading{Stille Nacht}
\\tmpimage{s/Stille-Nacht/piano/piano.eps}

\\tmpheading{Swing low}
\\tmpimage{s/Swing-low/piano/piano_1.eps}
\\tmpimage{s/Swing-low/piano/piano_2.eps}
\\tmpimage{s/Swing-low/piano/piano_3.eps}
\\tmpplaceholder
`)
        })

        it('groupAlphabetically = false, pageTurnOptimized = false', function () {
          let pianoScore = new PianoScore(mkTmpFile(), library, false, false)
          let texMarkup = pianoScore.build()
          assert.strictEqual(texMarkup, `
\\tmpheading{Auf der Mauer, auf der Lauer}
\\tmpimage{a/Auf-der-Mauer/piano/piano_1.eps}
\\tmpimage{a/Auf-der-Mauer/piano/piano_2.eps}
\\tmpimage{a/Auf-der-Mauer/piano/piano_3.eps}

\\tmpheading{Stille Nacht}
\\tmpimage{s/Stille-Nacht/piano/piano.eps}

\\tmpheading{Swing low}
\\tmpimage{s/Swing-low/piano/piano_1.eps}
\\tmpimage{s/Swing-low/piano/piano_2.eps}
\\tmpimage{s/Swing-low/piano/piano_3.eps}

\\tmpheading{Zum Tanze, da geht ein Mädel}
\\tmpimage{z/Zum-Tanze-da-geht-ein-Maedel/piano/piano_1.eps}
\\tmpimage{z/Zum-Tanze-da-geht-ein-Maedel/piano/piano_2.eps}
`)
        })
      })

      describe('Method “write()”', function () {
        it('groupAlphabetically = true, pageTurnOptimized = true', function () {
          let pianoScore = new PianoScore(mkTmpFile(), library, true, true)
          pianoScore.write()
          let texMarkup = pianoScore.texFile.read()
          let compare = readPathSegments('files', 'songs_page_turn_optimized.tex')
          assertExists(pianoScore.texFile.path)
          assert.strictEqual(texMarkup, compare)
        })

        it('groupAlphabetically = true, pageTurnOptimized = false', function () {
          let pianoScore = new PianoScore(mkTmpFile(), library, true, false)
          pianoScore.write()
          let texMarkup = pianoScore.texFile.read()
          let compare = readPathSegments('files', 'songs_processed.tex')
          assertExists(pianoScore.texFile.path)
          assert.strictEqual(texMarkup, compare)
          assert.ok(texMarkup.indexOf('\\tmpimage') > -1)
          assert.ok(texMarkup.indexOf('\\tmpheading') > -1)
        })

        it('defaults', function () {
          let pianoScore = new PianoScore(mkTmpFile(), library)
          pianoScore.write()
          let texMarkup = pianoScore.texFile.read()
          assert.strictEqual(texMarkup, `

\\tmpchapter{A}
\\tmpplaceholder
\\tmpplaceholder

\\tmpheading{Auf der Mauer, auf der Lauer}
\\tmpimage{a/Auf-der-Mauer/piano/piano_1.eps}
\\tmpimage{a/Auf-der-Mauer/piano/piano_2.eps}
\\tmpimage{a/Auf-der-Mauer/piano/piano_3.eps}
\\tmpplaceholder


\\tmpchapter{S}

\\tmpheading{Stille Nacht}
\\tmpimage{s/Stille-Nacht/piano/piano.eps}
\\tmpplaceholder

\\tmpheading{Swing low}
\\tmpimage{s/Swing-low/piano/piano_1.eps}
\\tmpimage{s/Swing-low/piano/piano_2.eps}
\\tmpimage{s/Swing-low/piano/piano_3.eps}
\\tmpplaceholder


\\tmpchapter{Z}

\\tmpheading{Zum Tanze, da geht ein Mädel}
\\tmpimage{z/Zum-Tanze-da-geht-ein-Maedel/piano/piano_1.eps}
\\tmpimage{z/Zum-Tanze-da-geht-ein-Maedel/piano/piano_2.eps}
`)
        })
      })
    })
  })

  describe('Class “Library()”', function () {
    let Library = libRewired.__get__('Library')
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

      it('Property “fileMonitor”', function () {
        let FileMonitor = libRewired.__get__('FileMonitor')
        assert.ok(library.fileMonitor instanceof FileMonitor)
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

      it('Method “cleanIntermediateFiles()”', function () {
        let tmpDir = mkTmpDir()
        fs.copySync(basePath, tmpDir)
        let library = new Library(tmpDir)
        library.cleanIntermediateFiles()
        assert.ok(!fs.existsSync(path.join(library.basePath, 'songs.tex')))
      })

      describe('Method “generateIntermediateFiles()”', function () {
        it('force = false', function () {
          let spy = sinon.spy()
          let stub = sinon.stub()
          libRewired.__set__('message.songFolder', stub)
          let library = new Library(basePath)
          for (let songID in library.songs) {
            library.songs[songID].generateIntermediateFiles = spy
          }
          library.generateIntermediateFiles('all', false)
          assert.strictEqual(spy.callCount, 4)
          assert.ok(spy.calledWith('all', false))
          stub()
        })

        it('force = true', function () {
          let spy = sinon.spy()
          let stub = sinon.stub()
          libRewired.__set__('message.songFolder', stub)
          let library = new Library(basePath)
          for (let songID in library.songs) {
            library.songs[songID].generateIntermediateFiles = spy
          }
          library.generateIntermediateFiles('all', true)
          assert.ok(spy.calledWith('all', true))
          stub()
        })
      })

      describe('Method “updateSongByPath()”', function () {
        it('No exception', function () {
          let clean = path.join('test', 'songs', 'clean', 'some')
          library = new Library(clean)
          library.updateSongByPath(path.join(clean, 'a', 'Auf-der-Mauer'))
          assertExists(path.join(library.basePath, 'a', 'Auf-der-Mauer', 'slides', '01.svg'))
        })

        it('Exception', function () {
          assert.throws(
            function () {
              library.updateSongByPath('xxx')
            },
            /^.*no such file or directory.*$/
          )
        })
      })

      describe('Method “updateSongBySongId()”', function () {
        it('No exception', function () {
          let clean = path.join('test', 'songs', 'clean', 'some')
          library = new Library(clean)
          library.updateSongBySongId('Auf-der-Mauer')
          assertExists(path.join(library.basePath, 'a', 'Auf-der-Mauer', 'slides', '01.svg'))
        })

        it('Exception', function () {
          assert.throws(
            function () {
              library.updateSongBySongId('lol')
            },
            /^.*The song with the song ID “lol” is unkown.*$/
          )
        })
      })

      describe('Method “update()”', function () {
        let stub = sinon.stub()
        libRewired.__set__('message.songFolder', stub)

        let songs = path.join('test', 'songs', 'clean', 'some')

        let buildFolderList = function (basePath) {
          return [
            path.join(basePath, 'a', 'Auf-der-Mauer'),
            path.join(basePath, 's', 'Swing-low'),
            path.join(basePath, 'z', 'Zum-Tanze-da-geht-ein-Maedel')
          ]
        }

        it('Exception', function () {
          assert.throws(
            function () {
              library.update('lol')
            },
            /^.*The parameter “mode” must be one of this strings: “all”, “slides” or “piano”.*$/
          )
          library.cleanIntermediateFiles()
        })

        it('mode = all', function () {
          let tmpDir = mkTmpDir()
          fs.copySync(songs, tmpDir)
          let library = new Library(tmpDir)
          library.update()

          const folders = buildFolderList(tmpDir)

          for (let i = 0; i < folders.length; ++i) {
            assertExists(folders[i], 'slides')
            assertExists(folders[i], 'slides', '01.svg')
            assertExists(folders[i], 'piano')
            assertExists(folders[i], 'piano', 'piano.mscx')
          }

          assertExists(tmpDir, 'a', 'Auf-der-Mauer', 'piano', 'piano_1.eps')
          assertExists(tmpDir, 's', 'Swing-low', 'piano', 'piano_1.eps')
          assertExists(tmpDir, 'z', 'Zum-Tanze-da-geht-ein-Maedel', 'piano', 'piano_1.eps')
          assertExists(tmpDir, 'z', 'Zum-Tanze-da-geht-ein-Maedel', 'piano', 'piano_2.eps')
        })

        it('mode = piano', function () {
          let stub = sinon.stub()
          libRewired.__set__('message.songFolder', stub)

          let songs = path.join('test', 'songs', 'clean', 'some')
          const auf = path.join(songs, 'a', 'Auf-der-Mauer')
          const swing = path.join(songs, 's', 'Swing-low')
          const zum = path.join(songs, 'z', 'Zum-Tanze-da-geht-ein-Maedel')
          const folders = [auf, swing, zum]

          let library = new Library(songs)
          library.fileMonitor.flush()
          library.update()

          for (let i = 0; i < folders.length; ++i) {
            assertExists(folders[i], 'slides')
            assertExists(folders[i], 'slides', '01.svg')
            assertExists(folders[i], 'piano')
            assertExists(folders[i], 'piano', 'piano.mscx')
          }

          assertExists(auf, 'piano', 'piano_1.eps')
          assertExists(swing, 'piano', 'piano_1.eps')
          assertExists(zum, 'piano', 'piano_1.eps')
          assertExists(zum, 'piano', 'piano_2.eps')

          library.cleanIntermediateFiles()
        })

        it('mode = slides', function () {
          let tmpDir = mkTmpDir()
          fs.copySync(songs, tmpDir)
          let library = new Library(tmpDir)
          library.update('slides')

          // const folders = buildFolderList(tmpDir)

          // for (let i = 0; i < folders.length; ++i) {
          //   assertExists(folders[i], 'slides')
          //   assertExists(folders[i], 'slides', '01.svg')
          //   assertNotExists(folders[i], 'piano')
          //   assertNotExists(folders[i], 'piano', 'piano.mscx')
          // }
          assertNotExists(tmpDir, 'songs.tex')
        })
      })
    })
  })
})
