const assert = require('assert')
const fs = require('fs-extra')
const indexRewired = require('rewire')('../index.js')
const path = require('path')
const process = require('process')
const sinon = require('sinon')
const spawn = require('child_process').spawnSync
const standard = require('mocha-standard')
const tmp = require('tmp')
const util = require('util')

process.env.PATH = path.join(__dirname, 'bin:', process.env.PATH)
process.env.BALDR_SONGBOOK_PATH = path.resolve('test', 'songs', 'clean', 'some')

let assertExists = function () {
  let file = path.join.apply(null, arguments)
  assert.ok(fs.existsSync(file), util.format('File exists not: %s', file))
}

let assertNotExists = function () {
  let file = path.join.apply(null, arguments)
  assert.ok(!fs.existsSync(file), util.format('File exists: %s', file))
}

let mkTmpDir = function () {
  return tmp.dirSync().name
}

let mkTmpFile = function () {
  return tmp.fileSync().name
}

let tmpCopy = function (folder1, folder2) {
  let tmpDir = mkTmpDir()
  fs.copySync(path.resolve('test', 'songs', folder1, folder2), tmpDir)
  return tmpDir
}

/**
 * String containing ANSI escape sequences are not working with Visual Studio Code’s Test Explorer.
 *
 * @param {string} string
 *
 * @returns {string} A cleaned string
 */
let removeANSI = function (string) {
  return string.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '') // eslint-disable-line
}

it('Conforms to standard', standard.files([
  '*.js', 'test/*.js'
]))

describe('Functions', function () {
  it('Function “texCmd()”', function () {
    let texCmd = indexRewired.__get__('texCmd')
    assert.strictEqual(texCmd('lorem', 'ipsum'), '\\tmplorem{ipsum}\n')
  })

  describe('Function “checkExecutable()”', function () {
    let checkExecutable = indexRewired.__get__('checkExecutable')

    it('Function “checkExecutable()”: existing executable', function () {
      assert.strictEqual(checkExecutable('echo'), true)
    })

    it('Function “checkExecutable()”: nonexisting executable', function () {
      assert.strictEqual(checkExecutable('loooooool'), false)
    })
  })

  describe('Function “checkExecutables()”', function () {
    let checkExecutables = indexRewired.__get__('checkExecutables')

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
    it('config.path', function () {
      let bootstrapConfig = indexRewired.__get__('bootstrapConfig')
      let config = bootstrapConfig()
      assert.strictEqual(config.path, path.resolve('test', 'songs', 'clean', 'some'))
    })

    it('exit', function () {
      let savePATH = process.env.PATH
      process.env.PATH = ''
      try {
        let bootstrapConfig = indexRewired.__get__('bootstrapConfig')
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

  describe('Function “parseCliArguments()”', function () {
    let parseCliArguments = indexRewired.__get__('parseCliArguments')
    it('version', function () {
      let args = parseCliArguments(['-', '-'], '1')
      assert.strictEqual(args.version(), '1')
    })

    it('--base-path', function () {
      let args = parseCliArguments(['-', '-', '--base-path', 'lol'], '1')
      assert.strictEqual(args.basePath, 'lol')
    })

    it('--slides', function () {
      let args = parseCliArguments(['-', '-', '--slides'], '1')
      assert.strictEqual(args.slides, true)
    })

    it('no --slides', function () {
      let args = parseCliArguments(['-', '-'], '1')
      assert.strictEqual(args.slides, undefined)
    })
  })

  describe('Function “assemblePianoDoublePage()”', function () {
    let assemblePianoDoublePage = indexRewired.__get__('assemblePianoDoublePage')

    /**
     * @param {object} config
     * <code><pre>
     * let config = {
     *   1: 4,
     *   2: 2,
     *   3: 3,
     *   4: 2
     * }
     * </pre><code>
     *
     */
    let generatePianoScoreObject = function (config) {
      let output = {}
      // Level 1: countCategory
      for (let countCategory in config) {
        // Level 2: numberOfSongs
        if (!output.hasOwnProperty(countCategory)) output[countCategory] = []
        let numberOfSongs = config[countCategory]
        let songs = []
        for (let i = 1; i <= numberOfSongs; i++) {
          let song = {}
          song.title = `${countCategory}-${i}`
          songs.push(song)
        }
        output[countCategory] = songs
      }
      return output
    }

    let getSongs = function (pageCount, config) {
      return assemblePianoDoublePage(generatePianoScoreObject(config), [], pageCount)
    }

    describe('Helper function “generatePianoScoreObject()”', function () {
      it('Single entry', function () {
        let pianoScores = generatePianoScoreObject({ 1: 1 })
        assert.deepStrictEqual(pianoScores, {
          '1': [{ 'title': '1-1' }]
        })
      })

      it('More entries', function () {
        let pianoScores = generatePianoScoreObject({ 1: 1, 2: 2, 3: 3 })
        assert.deepStrictEqual(pianoScores, {
          '1': [{ 'title': '1-1' }],
          '2': [{ 'title': '2-1' }, { 'title': '2-2' }],
          '3': [{ 'title': '3-1' }, { 'title': '3-2' }, { 'title': '3-3' }]
        })
      })
    })

    it('2 pages per unit <- 1-page-song * 1', function () {
      assert.deepStrictEqual(
        getSongs(2, { 1: 1 }),
        [{ 'title': '1-1' }]
      )
    })

    it('4 pages per unit <- 1-page-song * 4', function () {
      assert.deepStrictEqual(
        getSongs(4, { 1: 4 }),
        [{ 'title': '1-1' }, { 'title': '1-2' }, { 'title': '1-3' }, { 'title': '1-4' }]
      )
    })

    it('4 pages per unit <- 1-page-song * 4', function () {
      assert.deepStrictEqual(
        getSongs(4, { 4: 2 }),
        [{ 'title': '4-1' }]
      )
    })

    it('4 pages per unit <- 1-page-song, 2-page-song, 4-page-song * 2', function () {
      assert.deepStrictEqual(
        getSongs(4, { 1: 1, 2: 1, 4: 2 }),
        [{ 'title': '4-1' }]
      )
    })

    it('2 pages per unit <- 3-page-song', function () {
      assert.deepStrictEqual(
        getSongs(2, { 3: 1 }),
        []
      )
    })
  })
})

describe('Classes', function () {
  describe('Class “Message()”', function () {
    let Message = indexRewired.__get__('Message')
    let message = indexRewired.__get__('message')
    let Song = indexRewired.__get__('Song')
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

  describe('Class “TeXFile()”', function () {
    let TeXFile = indexRewired.__get__('TeXFile')

    it('Property “path”', function () {
      let tmpFile = mkTmpFile()
      let texFile = new TeXFile(tmpFile)
      assert.strictEqual(texFile.path, tmpFile)
    })

    describe('Methods', function () {
      it('Method “append()”', function () {
        let texFile = new TeXFile(mkTmpFile())
        texFile.append('test')
      })

      it('Method “read()”', function () {
        let texFile = new TeXFile(mkTmpFile())
        texFile.append('test')
        assert.strictEqual(texFile.read(), 'test')
      })

      it('Method “flush()”', function () {
        let texFile = new TeXFile(mkTmpFile())
        texFile.append('test')
        texFile.flush('test')
        assert.strictEqual(texFile.read(), '')
      })
      it('Method “remove()”', function () {
        let texFile = new TeXFile(mkTmpFile())
        assertExists(texFile.path)
        texFile.remove()
        assertNotExists(texFile.path)
      })
    })
  })

  describe('Class “Folder()”', function () {
    let Folder = indexRewired.__get__('Folder')

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
    let Sqlite = indexRewired.__get__('Sqlite')
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
    let FileMonitor = indexRewired.__get__('FileMonitor')
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
    let SongMetaData = indexRewired.__get__('SongMetaData')
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
    let SongMetaDataCombined = indexRewired.__get__('SongMetaDataCombined')

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
      it('no properties', function () {
        let song = new SongMetaDataCombined({})
        assert.strictEqual(song.composer, '')
      })
    })

    describe('Real world example', function () {
      let SongMetaData = indexRewired.__get__('SongMetaData')
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
    let Song = indexRewired.__get__('Song')
    let FileMonitor = indexRewired.__get__('FileMonitor')
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
        let SongMetaData = indexRewired.__get__('SongMetaData')
        assert.ok(song.metaData instanceof SongMetaData)
      })

      it('Property “metaDataCombined”', function () {
        let SongMetaDataCombined = indexRewired.__get__('SongMetaDataCombined')
        assert.ok(song.metaDataCombined instanceof SongMetaDataCombined)
      })

      it('Property “folderSlides”', function () {
        let Folder = indexRewired.__get__('Folder')
        assert.ok(song.folderSlides instanceof Folder)
      })

      it('Property “folderPiano”', function () {
        let Folder = indexRewired.__get__('Folder')
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
          assert.deepStrictEqual(song.pianoFiles, [])
        })

        it('not empty', function () {
          let song = new Song(path.join('test', 'songs', 'processed', 'some', 's', 'Swing-low'))
          assert.deepStrictEqual(song.pianoFiles, ['piano_1.eps', 'piano_2.eps', 'piano_3.eps'])
        })
      })

      describe('Property “slidesFiles”', function () {
        it('empty', function () {
          assert.deepStrictEqual(song.slidesFiles, [])
        })

        it('not empty', function () {
          let song = new Song(path.join('test', 'songs', 'processed', 'some', 's', 'Swing-low'))
          assert.deepStrictEqual(song.slidesFiles, ['01.svg', '02.svg', '03.svg'])
        })
      })
    })

    describe('Methods', function () {
      it('Method “normalizeSongFolder_(): folder”', function () {
        assert.strictEqual(song.normalizeSongFolder_(folder), folder)
      })

      it('Method “normalizeSongFolder_(): file', function () {
        assert.strictEqual(song.normalizeSongFolder_(path.join(folder, 'info.yml')), folder)
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

      it('Method “formatPianoTex()”', function () {
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

  describe('Class “Library()”', function () {
    let Library = indexRewired.__get__('Library')
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
        let FileMonitor = indexRewired.__get__('FileMonitor')
        assert.ok(library.fileMonitor instanceof FileMonitor)
      })

      it('Property “songs”', function () {
        assert.strictEqual(library.songs['Auf-der-Mauer'].songID, 'Auf-der-Mauer')
      })
    })

    describe('Methods', function () {
      it('Method “detectSongs_()”', function () {
        assert.strictEqual(library.detectSongs_().length, 4)
      })

      it('Method “gitPull()”', function () {
        assert.ok(!library.gitPull())
      })

      it('Method “getSongById()”', function () {
        assert.strictEqual(library.getSongById('Auf-der-Mauer').metaData.title, 'Auf der Mauer, auf der Lauer')
      })

      it('Method “getSongById()”: Exception', function () {
        assert.throws(
          function () {
            return library.getSongById('test')
          },
          /^.*There is no song with the songID: test$/
        )
      })

      it('Method “getABCFolders_()”', function () {
        let folders = library.getABCFolders_()
        assert.strictEqual(folders.length, 3)
        assert.deepStrictEqual(folders, ['a', 's', 'z'])
      })

      it('Method “buildAlphabeticalSongTree()”', function () {
        let folderTree = library.buildAlphabeticalSongTree()
        assert.deepStrictEqual(
          folderTree.a[0].songID,
          'Auf-der-Mauer')
        assert.deepStrictEqual(
          folderTree.s[0].songID,
          'Stille-Nacht')
      })

      it('Method “cleanIntermediateFiles()”', function () {
        let tmpDir = mkTmpDir()
        fs.copySync(basePath, tmpDir)
        let library = new Library(tmpDir)
        library.cleanIntermediateFiles()
        assert.ok(!fs.existsSync(path.join(library.basePath, 'songs.tex')))
      })

      it('Method “generateIntermediateFiles(force = false)”', function () {
        let spy = sinon.spy()
        let stub = sinon.stub()
        indexRewired.__set__('message.songFolder', stub)
        let library = new Library(basePath)
        for (let songID in library.songs) {
          library.songs[songID].generateIntermediateFiles = spy
        }
        library.generateIntermediateFiles('all', false)
        assert.strictEqual(spy.callCount, 4)
        assert.ok(spy.calledWith('all', false))
        stub()
      })

      it('Method “generateIntermediateFiles(force = true)”', function () {
        let spy = sinon.spy()
        let stub = sinon.stub()
        indexRewired.__set__('message.songFolder', stub)
        let library = new Library(basePath)
        for (let songID in library.songs) {
          library.songs[songID].generateIntermediateFiles = spy
        }
        library.generateIntermediateFiles('all', true)
        assert.ok(spy.calledWith('all', true))
        stub()
      })

      it('Method “buildPianoFilesCountTree()”', function () {
        let tree = library.buildPianoFilesCountTree()
        assert.strictEqual(tree.a[3][0].metaData.title, 'Auf der Mauer, auf der Lauer')
        assert.strictEqual(tree.s[1][0].metaData.title, 'Stille Nacht')
        assert.strictEqual(tree.s[3][0].metaData.title, 'Swing low')
        assert.strictEqual(tree.z[2][0].metaData.title, 'Zum Tanze, da geht ein Mädel')
      })

      it('Method “countPianoFilesCountTree()”', function () {
        let tree = library.buildPianoFilesCountTree()
        assert.strictEqual(library.countPianoFilesCountTree(tree.a), 1)
        assert.strictEqual(library.countPianoFilesCountTree(tree.s), 2)
      })

      it('Method “generateTeX()”', function () {
        library.generateTeX()
        let texFile = path.join(library.basePath, 'songs.tex')

        assertExists(texFile)

        let texContent = fs.readFileSync(texFile, 'utf8')
        let compare = fs.readFileSync(
          path.join('test', 'files', 'songs_processed.tex'), 'utf8'
        )

        assert.strictEqual(texContent, compare)

        assert.ok(texContent.indexOf('\\tmpimage') > -1)
        assert.ok(texContent.indexOf('\\tmpheading') > -1)
      })

      describe('Method “update()”', function () {
        let stub = sinon.stub()
        indexRewired.__set__('message.songFolder', stub)

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

          assertExists(tmpDir, 'songs.tex')
        })

        it('mode = piano', function () {
          let stub = sinon.stub()
          indexRewired.__set__('message.songFolder', stub)

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

describe('Command line interface', function () {
  const baseArgv = [
    '/usr/bin/node',
    path.join(path.resolve('.'), 'index.js')
  ]

  const callMainWithArgv = function (argv) {
    let main = indexRewired.__get__('main')
    indexRewired.__set__('process.argv', baseArgv.concat(argv))
    main()
    return indexRewired
  }

  const read = function (file) {
    return fs.readFileSync(file, 'utf-8')
  }

  describe('Require as module', function () {
    it('--base-path', function () {
      let Message = indexRewired.__get__('Message')
      let message = new Message()
      let stub = sinon.stub()
      message.print = stub
      indexRewired.__set__('message', message)
      let tmpDir = tmpCopy('clean', 'one')
      indexRewired.__set__('process.argv', [
        '', '', '--base-path', tmpDir
      ])
      indexRewired.__get__('main')()
      assert.strictEqual(removeANSI(stub.args[0][0]), removeANSI('\u001b[33m☐\u001b[39m  \u001b[33mAuf-der-Mauer\u001b[39m: Auf der Mauer, auf der Lauer\n\t\u001b[33mslides\u001b[39m: 01.svg, 02.svg\n\t\u001b[33mpiano\u001b[39m: piano_1.eps, piano_2.eps'))
    })

    it.skip('--piano', function () {
      callMainWithArgv(['--base-path', path.join('test', 'songs', 'processed', 'one'), '--piano'])
      let tex = path.join('test', 'songs', 'processed', 'one', 'songs.tex')

      assertExists(tex)
      assert.strictEqual(
        read(tex),
        read(path.join('test', 'files', 'songs_min_processed.tex'))
      )
      fs.unlinkSync(tex)
    })

    it('--folder', function () {
      const indexRewired = require('rewire')('../index.js')
      let Message = indexRewired.__get__('Message')
      let message = new Message()
      let stub = sinon.stub()
      message.print = stub
      indexRewired.__set__('message', message)
      let tmpDir = tmpCopy('clean', 'one')
      let main = indexRewired.__get__('main')
      indexRewired.__set__('process.argv', [
        '', '',
        '--base-path', tmpDir,
        '--folder',
        path.join(tmpDir, 'a', 'Auf-der-Mauer')
      ])
      main()
      let output = stub.args[0][0]
      assert.ok(output.includes('Auf-der-Mauer'))
      assert.ok(output.includes('01.svg, 02.svg'))
      assert.ok(output.includes('piano_1.eps, piano_2.eps'))
    })
  })

  describe('Command line', function () {
    it('--base-path', function () {
      let tmpDir = tmpCopy('clean', 'one')
      spawn('./index.js', ['--base-path', tmpDir])
      assertExists(tmpDir, 'a', 'Auf-der-Mauer', 'piano', 'piano.mscx')
      assertExists(tmpDir, 'songs.tex')
      assertExists(tmpDir, 'a', 'Auf-der-Mauer', 'slides', '01.svg')
      assertExists(tmpDir, 'a', 'Auf-der-Mauer', 'projector.pdf')
    })

    it('--piano', function () {
      let tmpDir = tmpCopy('clean', 'one')
      spawn('./index.js', ['--base-path', tmpDir, '--piano'])
      assertExists(tmpDir, 'a', 'Auf-der-Mauer', 'piano', 'piano.mscx')
      assertExists(tmpDir, 'songs.tex')
      assertNotExists(tmpDir, 'a', 'Auf-der-Mauer', 'slides', '01.svg')
      assertNotExists(tmpDir, 'a', 'Auf-der-Mauer', 'projector.pdf')
    })

    it('--slides', function () {
      let tmpDir = tmpCopy('clean', 'one')
      spawn('./index.js', ['--base-path', tmpDir, '--slides'])
      assertExists(tmpDir, 'a', 'Auf-der-Mauer', 'slides', '01.svg')
      assertExists(tmpDir, 'a', 'Auf-der-Mauer', 'projector.pdf')
      assertNotExists(tmpDir, 'a', 'Auf-der-Mauer', 'piano', 'piano.mscx')
      assertNotExists(tmpDir, 'songs.tex')
    })

    it('--force', function () {
      let tmpDir = tmpCopy('clean', 'one')
      let notForced = spawn('./index.js', ['--base-path', tmpDir])
      assert.ok(!notForced.stdout.toString().includes('(forced)'))
      let forced = spawn('./index.js', ['--base-path', tmpDir, '--force'])
      assert.ok(forced.stdout.toString().includes('(forced)'))
    })

    it('--help', function () {
      const cli = spawn('./index.js', ['--help'])
      let out = cli.stdout.toString()
      assert.ok(out.indexOf('Usage') > -1)
      assert.ok(out.indexOf('--help') > -1)
      assert.ok(out.indexOf('--version') > -1)
      assert.strictEqual(cli.status, 0)
    })

    it('--version', function () {
      const cli = spawn('./index.js', ['--version'])
      let pckg = require('../package.json')
      assert.strictEqual(cli.stdout.toString(), pckg.version + '\n')
      assert.strictEqual(cli.status, 0)
    })

    it('--clean', function () {
      let tmpDir = tmpCopy('processed', 'one')
      spawn('./index.js', ['--base-path', tmpDir, '--clean'])
      assertNotExists(tmpDir, 's', 'Swing-low', 'piano', 'piano.mscx')
    })
  })
})
