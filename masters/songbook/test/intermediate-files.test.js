const assert = require('assert')
const fs = require('fs-extra')
const intermediateRewired = require('rewire')('@bldr/songbook-intermediate-files')
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
  tmpCopy
} = require('./_helper.js')

process.env.PATH = path.join(__dirname, 'bin:', process.env.PATH)
process.env.BALDR_SONGBOOK_PATH = path.resolve(__dirname, 'songs', 'clean', 'some')

describe('Package “@bldr/songbook-intermediate-files”', function () {
  describe('Functions', function () {
    describe('Function “checkExecutable()”', function () {
      const checkExecutable = intermediateRewired.__get__('checkExecutable')

      it('Function “checkExecutable()”: existing executable', function () {
        assert.strictEqual(checkExecutable('echo'), true)
      })

      it('Function “checkExecutable()”: nonexisting executable', function () {
        assert.strictEqual(checkExecutable('loooooool'), false)
      })
    })

    describe('Function “checkExecutables()”', function () {
      const checkExecutables = intermediateRewired.__get__('checkExecutables')

      it('all are existing', function () {
        const { status, unavailable } = checkExecutables(['echo', 'ls'])
        assert.strictEqual(status, true)
        assert.deepStrictEqual(unavailable, [])
      })

      it('one executable', function () {
        const { status, unavailable } = checkExecutables(['echo'])
        assert.strictEqual(status, true)
        assert.deepStrictEqual(unavailable, [])
      })

      it('one nonexisting executable', function () {
        const { status, unavailable } = checkExecutables(['echo', 'loooooool'])
        assert.strictEqual(status, false)
        assert.deepStrictEqual(unavailable, ['loooooool'])
      })

      it('two nonexisting executable', function () {
        const { status, unavailable } = checkExecutables(['troooooool', 'loooooool'])
        assert.strictEqual(status, false)
        assert.deepStrictEqual(unavailable, ['troooooool', 'loooooool'])
      })

      it('without arguments', function () {
        const { status, unavailable } = checkExecutables()
        assert.strictEqual(status, true)
        assert.deepStrictEqual(unavailable, [])
      })
    })
  })
  describe('Classes', function () {
    describe('Class “TextFile()”', function () {
      const TextFile = intermediateRewired.__get__('TextFile')

      it('Property “path”', function () {
        const tmpFile = mkTmpFile()
        const texFile = new TextFile(tmpFile)
        assert.strictEqual(texFile.path, tmpFile)
      })

      describe('Methods', function () {
        it('Method “append()”', function () {
          const texFile = new TextFile(mkTmpFile())
          texFile.append('test')
        })

        it('Method “read()”', function () {
          const texFile = new TextFile(mkTmpFile())
          texFile.append('test')
          assert.strictEqual(texFile.read(), 'test')
        })

        it('Method “flush()”', function () {
          const texFile = new TextFile(mkTmpFile())
          texFile.append('test')
          texFile.flush('test')
          assert.strictEqual(texFile.read(), '')
        })
        it('Method “remove()”', function () {
          const texFile = new TextFile(mkTmpFile())
          assertExists(texFile.path)
          texFile.remove()
          assertNotExists(texFile.path)
        })
      })
    })

    describe('Class “Sqlite()”', function () {
      const Sqlite = intermediateRewired.__get__('Sqlite')
      const tmpDir = mkTmpDir()
      const testDb = path.join(tmpDir, 'test.db')
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
      })

      describe('Methods', function () {
        describe('Method “insert()”', function () {
          it('Successful insert', function () {
            db.insert('lol', 'toll')
            const row = db.select('lol')
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
      const FileMonitor = intermediateRewired.__get__('FileMonitor')
      const tmpDir = mkTmpDir()
      const testDb = path.join(tmpDir, 'file-monitor.db')
      const testFile = path.join(tmpDir, 'file-monitor.txt')
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
            monitor.hashSHA1(path.join(__dirname, 'files', 'hash.txt')),
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

    describe('Class “PianoScore()”', function () {
      const PianoScore = intermediateRewired.__get__('PianoScore')
      const PianoFilesCountTree = intermediateRewired.__get__('PianoFilesCountTree')
      const IntermediateLibrary = intermediateRewired.__get__('IntermediateLibrary')
      const tmpDir = tmpCopy('processed', 'some')
      const library = new IntermediateLibrary(tmpDir)
      const songs = library.toArray()

      it('Initialisation', function () {
        const pianoScore = new PianoScore(library)
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
          const fakeSelectSongs = function (pageCount, config) {
            const songs = fakeSongs(config)
            const countTree = new PianoFilesCountTree(songs)
            return PianoScore.selectSongs(countTree, [], pageCount)
          }

          it('4 pages per unit <- 1-page-song, 2-page-song x2, 3-page-song x3', function () {
            const result = fakeSelectSongs(4, { 1: 1, 2: 2, 3: 3 })
            assert.strictEqual(result.length, 2)
            assert.strictEqual(result[0].pianoFiles.length, '3')
            assert.strictEqual(result[1].pianoFiles.length, '1')
          })

          it('2 pages per unit <- 1-page-song x1', function () {
            const result = fakeSelectSongs(2, { 1: 1 })
            assert.strictEqual(result.length, 1)
            assert.strictEqual(result[0].pianoFiles.length, '1')
          })

          it('4 pages per unit <- 1-page-song x4', function () {
            const result = fakeSelectSongs(4, { 1: 4 })
            assert.strictEqual(result.length, 4)
            assert.strictEqual(result[0].pianoFiles.length, '1')
            assert.strictEqual(result[1].pianoFiles.length, '1')
            assert.strictEqual(result[2].pianoFiles.length, '1')
            assert.strictEqual(result[3].pianoFiles.length, '1')
          })

          it('4 pages per unit <- 4-page-song x2', function () {
            const result = fakeSelectSongs(4, { 4: 2 })
            assert.strictEqual(result.length, 1)
            assert.strictEqual(result[0].pianoFiles.length, '4')
          })

          it('2 pages per unit <- 2-page-song x2', function () {
            const result = fakeSelectSongs(2, { 2: 2 })
            assert.strictEqual(result.length, 1)
            assert.strictEqual(result[0].pianoFiles.length, '2')
          })

          it('2 pages per unit <- 2-page-song', function () {
            const result = fakeSelectSongs(2, { 2: 1 })
            assert.strictEqual(result.length, 1)
            assert.strictEqual(result[0].pianoFiles.length, '2')
          })

          it('4 pages per unit <- 1-page-song, 2-page-song, 4-page-song x2', function () {
            const result = fakeSelectSongs(4, { 1: 1, 2: 1, 4: 2 })
            assert.strictEqual(result.length, 1)
            assert.strictEqual(result[0].pianoFiles.length, '4')
          })

          it('2 pages per unit <- 3-page-song', function () {
            const result = fakeSelectSongs(2, { 3: 1 })
            assert.strictEqual(result.length, 0)
          })

          it('4 pages per unit <- 1-page-song x3, 2-page-song x3, 3-page-song x3', function () {
            const result = fakeSelectSongs(4, { 1: 3, 2: 3, 3: 3 })
            assert.strictEqual(result.length, 2)
            assert.strictEqual(result[0].pianoFiles.length, '3')
            assert.strictEqual(result[1].pianoFiles.length, '1')
          })
        })

        describe('Static method “buildSongList()”', function () {
          it('pageTurnOptimized = false', function () {
            const texMarkup = PianoScore.buildSongList(songs, false)
            assert.strictEqual(texMarkup, `
\\tmpmetadata
{Auf der Mauer, auf der Lauer} % title
{} % subtitle
{} % composer
{} % lyricist
\\tmpimage{a/Auf-der-Mauer/piano/piano_1.eps}
\\tmpcolumnbreak
\\tmpimage{a/Auf-der-Mauer/piano/piano_2.eps}
\\tmpcolumnbreak
\\tmpimage{a/Auf-der-Mauer/piano/piano_3.eps}
\\tmpcolumnbreak

\\tmpmetadata
{Stille Nacht} % title
{} % subtitle
{} % composer
{} % lyricist
\\tmpimage{s/Stille-Nacht/piano/piano.eps}
\\tmpcolumnbreak

\\tmpmetadata
{Swing low} % title
{} % subtitle
{} % composer
{} % lyricist
\\tmpimage{s/Swing-low/piano/piano_1.eps}
\\tmpcolumnbreak
\\tmpimage{s/Swing-low/piano/piano_2.eps}
\\tmpcolumnbreak
\\tmpimage{s/Swing-low/piano/piano_3.eps}
\\tmpcolumnbreak

\\tmpmetadata
{Zum Tanze, da geht ein Mädel} % title
{} % subtitle
{} % composer
{} % lyricist
\\tmpimage{z/Zum-Tanze-da-geht-ein-Maedel/piano/piano_1.eps}
\\tmpcolumnbreak
\\tmpimage{z/Zum-Tanze-da-geht-ein-Maedel/piano/piano_2.eps}
`)
          })

          it('pageTurnOptimized = true', function () {
            const texMarkup = PianoScore.buildSongList(songs, true)
            assert.strictEqual(texMarkup, `
\\tmpmetadata
{Zum Tanze, da geht ein Mädel} % title
{} % subtitle
{} % composer
{} % lyricist
\\tmpimage{z/Zum-Tanze-da-geht-ein-Maedel/piano/piano_1.eps}
\\tmpcolumnbreak
\\tmpimage{z/Zum-Tanze-da-geht-ein-Maedel/piano/piano_2.eps}
\\tmpcolumnbreak

\\tmpmetadata
{Auf der Mauer, auf der Lauer} % title
{} % subtitle
{} % composer
{} % lyricist
\\tmpimage{a/Auf-der-Mauer/piano/piano_1.eps}
\\tmpcolumnbreak
\\tmpimage{a/Auf-der-Mauer/piano/piano_2.eps}
\\tmpcolumnbreak
\\tmpimage{a/Auf-der-Mauer/piano/piano_3.eps}
\\tmpcolumnbreak

\\tmpmetadata
{Stille Nacht} % title
{} % subtitle
{} % composer
{} % lyricist
\\tmpimage{s/Stille-Nacht/piano/piano.eps}
\\tmpcolumnbreak

\\tmpmetadata
{Swing low} % title
{} % subtitle
{} % composer
{} % lyricist
\\tmpimage{s/Swing-low/piano/piano_1.eps}
\\tmpcolumnbreak
\\tmpimage{s/Swing-low/piano/piano_2.eps}
\\tmpcolumnbreak
\\tmpimage{s/Swing-low/piano/piano_3.eps}
`)
          })
        })

        describe('Method “build()”', function () {
          it('groupAlphabetically = true, pageTurnOptimized = true', function () {
            const pianoScore = new PianoScore(library, true, true)
            const texMarkup = pianoScore.build()
            assert.strictEqual(texMarkup, `

\\tmpchapter{A}
\\tmpplaceholder
\\tmpcolumnbreak
\\tmpplaceholder
\\tmpcolumnbreak

\\tmpmetadata
{Auf der Mauer, auf der Lauer} % title
{} % subtitle
{} % composer
{} % lyricist
\\tmpimage{a/Auf-der-Mauer/piano/piano_1.eps}
\\tmpcolumnbreak
\\tmpimage{a/Auf-der-Mauer/piano/piano_2.eps}
\\tmpcolumnbreak
\\tmpimage{a/Auf-der-Mauer/piano/piano_3.eps}


\\tmpchapter{S}

\\tmpmetadata
{Stille Nacht} % title
{} % subtitle
{} % composer
{} % lyricist
\\tmpimage{s/Stille-Nacht/piano/piano.eps}
\\tmpcolumnbreak
\\tmpplaceholder
\\tmpcolumnbreak

\\tmpmetadata
{Swing low} % title
{} % subtitle
{} % composer
{} % lyricist
\\tmpimage{s/Swing-low/piano/piano_1.eps}
\\tmpcolumnbreak
\\tmpimage{s/Swing-low/piano/piano_2.eps}
\\tmpcolumnbreak
\\tmpimage{s/Swing-low/piano/piano_3.eps}


\\tmpchapter{Z}

\\tmpmetadata
{Zum Tanze, da geht ein Mädel} % title
{} % subtitle
{} % composer
{} % lyricist
\\tmpimage{z/Zum-Tanze-da-geht-ein-Maedel/piano/piano_1.eps}
\\tmpcolumnbreak
\\tmpimage{z/Zum-Tanze-da-geht-ein-Maedel/piano/piano_2.eps}
`)
          })

          it('groupAlphabetically = true, pageTurnOptimized = false', function () {
            const pianoScore = new PianoScore(library, true, false)
            const texMarkup = pianoScore.build()
            assert.strictEqual(texMarkup, `

\\tmpchapter{A}

\\tmpmetadata
{Auf der Mauer, auf der Lauer} % title
{} % subtitle
{} % composer
{} % lyricist
\\tmpimage{a/Auf-der-Mauer/piano/piano_1.eps}
\\tmpcolumnbreak
\\tmpimage{a/Auf-der-Mauer/piano/piano_2.eps}
\\tmpcolumnbreak
\\tmpimage{a/Auf-der-Mauer/piano/piano_3.eps}


\\tmpchapter{S}

\\tmpmetadata
{Stille Nacht} % title
{} % subtitle
{} % composer
{} % lyricist
\\tmpimage{s/Stille-Nacht/piano/piano.eps}
\\tmpcolumnbreak

\\tmpmetadata
{Swing low} % title
{} % subtitle
{} % composer
{} % lyricist
\\tmpimage{s/Swing-low/piano/piano_1.eps}
\\tmpcolumnbreak
\\tmpimage{s/Swing-low/piano/piano_2.eps}
\\tmpcolumnbreak
\\tmpimage{s/Swing-low/piano/piano_3.eps}


\\tmpchapter{Z}

\\tmpmetadata
{Zum Tanze, da geht ein Mädel} % title
{} % subtitle
{} % composer
{} % lyricist
\\tmpimage{z/Zum-Tanze-da-geht-ein-Maedel/piano/piano_1.eps}
\\tmpcolumnbreak
\\tmpimage{z/Zum-Tanze-da-geht-ein-Maedel/piano/piano_2.eps}
`)
          })

          it('groupAlphabetically = false, pageTurnOptimized = true', function () {
            const pianoScore = new PianoScore(library, false, true)
            const texMarkup = pianoScore.build()
            assert.strictEqual(texMarkup, `
\\tmpmetadata
{Zum Tanze, da geht ein Mädel} % title
{} % subtitle
{} % composer
{} % lyricist
\\tmpimage{z/Zum-Tanze-da-geht-ein-Maedel/piano/piano_1.eps}
\\tmpcolumnbreak
\\tmpimage{z/Zum-Tanze-da-geht-ein-Maedel/piano/piano_2.eps}
\\tmpcolumnbreak

\\tmpmetadata
{Auf der Mauer, auf der Lauer} % title
{} % subtitle
{} % composer
{} % lyricist
\\tmpimage{a/Auf-der-Mauer/piano/piano_1.eps}
\\tmpcolumnbreak
\\tmpimage{a/Auf-der-Mauer/piano/piano_2.eps}
\\tmpcolumnbreak
\\tmpimage{a/Auf-der-Mauer/piano/piano_3.eps}
\\tmpcolumnbreak

\\tmpmetadata
{Stille Nacht} % title
{} % subtitle
{} % composer
{} % lyricist
\\tmpimage{s/Stille-Nacht/piano/piano.eps}
\\tmpcolumnbreak

\\tmpmetadata
{Swing low} % title
{} % subtitle
{} % composer
{} % lyricist
\\tmpimage{s/Swing-low/piano/piano_1.eps}
\\tmpcolumnbreak
\\tmpimage{s/Swing-low/piano/piano_2.eps}
\\tmpcolumnbreak
\\tmpimage{s/Swing-low/piano/piano_3.eps}
`)
          })

          it('groupAlphabetically = false, pageTurnOptimized = false', function () {
            const pianoScore = new PianoScore(library, false, false)
            const texMarkup = pianoScore.build()
            assert.strictEqual(texMarkup, `
\\tmpmetadata
{Auf der Mauer, auf der Lauer} % title
{} % subtitle
{} % composer
{} % lyricist
\\tmpimage{a/Auf-der-Mauer/piano/piano_1.eps}
\\tmpcolumnbreak
\\tmpimage{a/Auf-der-Mauer/piano/piano_2.eps}
\\tmpcolumnbreak
\\tmpimage{a/Auf-der-Mauer/piano/piano_3.eps}
\\tmpcolumnbreak

\\tmpmetadata
{Stille Nacht} % title
{} % subtitle
{} % composer
{} % lyricist
\\tmpimage{s/Stille-Nacht/piano/piano.eps}
\\tmpcolumnbreak

\\tmpmetadata
{Swing low} % title
{} % subtitle
{} % composer
{} % lyricist
\\tmpimage{s/Swing-low/piano/piano_1.eps}
\\tmpcolumnbreak
\\tmpimage{s/Swing-low/piano/piano_2.eps}
\\tmpcolumnbreak
\\tmpimage{s/Swing-low/piano/piano_3.eps}
\\tmpcolumnbreak

\\tmpmetadata
{Zum Tanze, da geht ein Mädel} % title
{} % subtitle
{} % composer
{} % lyricist
\\tmpimage{z/Zum-Tanze-da-geht-ein-Maedel/piano/piano_1.eps}
\\tmpcolumnbreak
\\tmpimage{z/Zum-Tanze-da-geht-ein-Maedel/piano/piano_2.eps}
`)
          })
        })

        describe('Method “compile()”', function () {
          const cleanOutput = function (input) {
            let output = input.replace(/^[^]*% begin song list %\n/g, '')
            output = output.replace(/\n% end song list %[^]*$/g, '')
            return output
          }

          it('groupAlphabetically = true, pageTurnOptimized = true', function () {
            const pianoScore = new PianoScore(library, true, true)
            pianoScore.compile()
            const texMarkup = cleanOutput(pianoScore.texFile.read())
            const compare = readPathSegments('files', 'songs_page_turn_optimized.tex')
            assertExists(pianoScore.texFile.path)
            assert.strictEqual(texMarkup, compare)
          })

          it('groupAlphabetically = true, pageTurnOptimized = false', function () {
            const pianoScore = new PianoScore(library, true, false)
            pianoScore.compile()
            const texMarkup = cleanOutput(pianoScore.texFile.read())
            const compare = readPathSegments('files', 'songs_processed.tex')
            assertExists(pianoScore.texFile.path)
            assert.strictEqual(texMarkup, compare)
            assert.ok(texMarkup.indexOf('\\tmpimage') > -1)
            assert.ok(texMarkup.indexOf('\\tmpmetadata') > -1)
          })

          it('defaults', function () {
            const pianoScore = new PianoScore(library)
            pianoScore.compile()
            const texMarkup = cleanOutput(pianoScore.texFile.read())
            assert.strictEqual(texMarkup, `

\\tmpchapter{A}
\\tmpplaceholder
\\tmpcolumnbreak
\\tmpplaceholder
\\tmpcolumnbreak

\\tmpmetadata
{Auf der Mauer, auf der Lauer} % title
{} % subtitle
{} % composer
{} % lyricist
\\tmpimage{a/Auf-der-Mauer/piano/piano_1.eps}
\\tmpcolumnbreak
\\tmpimage{a/Auf-der-Mauer/piano/piano_2.eps}
\\tmpcolumnbreak
\\tmpimage{a/Auf-der-Mauer/piano/piano_3.eps}


\\tmpchapter{S}

\\tmpmetadata
{Stille Nacht} % title
{} % subtitle
{} % composer
{} % lyricist
\\tmpimage{s/Stille-Nacht/piano/piano.eps}
\\tmpcolumnbreak
\\tmpplaceholder
\\tmpcolumnbreak

\\tmpmetadata
{Swing low} % title
{} % subtitle
{} % composer
{} % lyricist
\\tmpimage{s/Swing-low/piano/piano_1.eps}
\\tmpcolumnbreak
\\tmpimage{s/Swing-low/piano/piano_2.eps}
\\tmpcolumnbreak
\\tmpimage{s/Swing-low/piano/piano_3.eps}


\\tmpchapter{Z}

\\tmpmetadata
{Zum Tanze, da geht ein Mädel} % title
{} % subtitle
{} % composer
{} % lyricist
\\tmpimage{z/Zum-Tanze-da-geht-ein-Maedel/piano/piano_1.eps}
\\tmpcolumnbreak
\\tmpimage{z/Zum-Tanze-da-geht-ein-Maedel/piano/piano_2.eps}
`)
          })
        })
      })
    })

    describe('Class “IntermediateSong()”', function () {
      const IntermediateSong = intermediateRewired.__get__('IntermediateSong')
      const FileMonitor = intermediateRewired.__get__('FileMonitor')
      const fileMonitor = new FileMonitor(mkTmpFile())
      const folder = path.join(__dirname, 'songs', 'clean', 'some', 'a', 'Auf-der-Mauer')
      const song = new IntermediateSong(folder, null, null, fileMonitor)

      afterEach(function () {
        fileMonitor.flush()
      })

      describe('Methods', function () {
        it('Method “formatPianoTeXEpsFile_()”', function () {
          const folder = path.join(__dirname, 'songs', 'processed', 'some', 's', 'Swing-low')
          const song = new IntermediateSong(folder)
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
            const folder = path.join(__dirname, 'songs', 'processed', 'some', 's', 'Swing-low')
            const song = new IntermediateSong(folder)
            assert.strictEqual(
              song.formatPianoTex(),
              '\n' +
              '\\tmpmetadata\n{Swing low} % title\n{} % subtitle\n{} % composer\n{} % lyricist\n' +
              '\\tmpimage{s/Swing-low/piano/piano_1.eps}\n' +
              '\\tmpcolumnbreak\n' +
              '\\tmpimage{s/Swing-low/piano/piano_2.eps}\n' +
              '\\tmpcolumnbreak\n' +
              '\\tmpimage{s/Swing-low/piano/piano_3.eps}\n'
            )
          })

          it('Exception: no EPS files', function () {
            const song = new IntermediateSong(folder)
            song.pianoFiles = []
            assert.throws(
              function () {
                song.formatPianoTex()
              },
              /^.*The song “Auf der Mauer, auf der Lauer” has no EPS piano score files\..*$/
            )
          })

          it('Exception: more than 4 EPS files', function () {
            const song = new IntermediateSong(folder)
            song.pianoFiles = [1, 2, 3, 4, 5]
            assert.throws(
              function () {
                song.formatPianoTex()
              },
              /^.*The song “Auf der Mauer, auf der Lauer” has more than 4 EPS piano score files\..*$/
            )
          })
        })

        it('Method “generatePDF_()”', function () {
          const file = song.generatePDF_('projector', 'projector')
          assert.strictEqual(file, 'projector.pdf')
          assertExists(folder, 'slides', 'projector.pdf')
        })

        it('Method “generateSlides_()”', function () {
          song.generatePDF_('projector')
          const slides = path.join(folder, 'slides')
          const files = song.generateSlides_(folder)

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
            const folderSwing = path.join(__dirname, 'songs', 'clean', 'some', 's', 'Swing-low')
            const songSwing = new IntermediateSong(folderSwing, null, null, fileMonitor)
            const files = songSwing.generatePiano_()

            assert.deepStrictEqual(files, ['piano_1.eps', 'piano_2.eps'])

            const result = [
              [folderSwing, 'piano'],
              [folderSwing, 'piano', 'piano.mscx'],
              [folderSwing, 'piano', 'piano_1.eps']
            ]
            result.forEach(args => { assertExists(...args) })

            fs.removeSync(path.join(folder, 'piano'))
          })

          it('piano', function () {
            const files = song.generatePiano_()

            assert.deepStrictEqual(
              files,
              ['piano_1.eps', 'piano_2.eps']
            )

            const result = [
              [folder, 'piano'],
              [folder, 'piano', 'piano.mscx'],
              [folder, 'piano', 'piano_1.eps']
            ]
            result.forEach(args => { assertExists(...args) })

            fs.removeSync(path.join(folder, 'piano'))
          })
        })

        describe('Method “generateIntermediateFiles()”', function () {
          it('First run', function () {
            const status = song.generateIntermediateFiles('all', false)
            status.folder = 'test'
            assert.deepStrictEqual(
              status,
              {
                changed: {
                  piano: true,
                  slides: true
                },
                folder: 'test',
                folderName: 'Auf-der-Mauer',
                force: false,
                generated: {
                  piano: [
                    'piano_1.eps',
                    'piano_2.eps'
                  ],
                  projector: 'projector.pdf',
                  slides: [
                    '01.svg',
                    '02.svg'
                  ]
                }
              }
            )
          })

          it('Second run', function () {
            song.generateIntermediateFiles('all', false)
            const status = song.generateIntermediateFiles('all', false)
            assert.strictEqual(status.changed.piano, false)
            assert.strictEqual(status.changed.slides, false)
          })

          it('force', function () {
            const status = song.generateIntermediateFiles('all', true)
            assert.strictEqual(status.force, true)
          })
        })

        it('Method “cleanIntermediateFiles()”', function () {
          const song = new IntermediateSong(path.join(__dirname, 'songs', 'clean', 'some', 's', 'Swing-low'), null, null, fileMonitor)
          song.generateIntermediateFiles('all', false)
          assert.ok(fs.existsSync(path.join(song.folder, 'slides', 'projector.pdf')))
          song.cleanIntermediateFiles()
          assert.ok(!fs.existsSync(path.join(song.folder, 'slides', 'projector.pdf')))
        })
      })
    })

    describe('Class “PianoFilesCountTree()”', function () {
      const PianoFilesCountTree = intermediateRewired.__get__('PianoFilesCountTree')
      const Library = intermediateRewired.__get__('Library')
      const library = new Library(path.join(__dirname, 'songs', 'processed', 'some'))
      const songs = Object.values(library.songs)
      const countTree = new PianoFilesCountTree(songs)

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
          const countTree = new PianoFilesCountTree(fakeSongs({ 1: 1 }))
          assert.strictEqual(countTree.sum(), 1)
        })

        it('many', function () {
          const countTree = new PianoFilesCountTree(fakeSongs({ 1: 1, 2: 2, 3: 3, 4: 4 }))
          assert.strictEqual(countTree.sum(), 10)
        })

        it('empty', function () {
          const countTree = new PianoFilesCountTree([])
          assert.strictEqual(countTree.sum(), 0)
        })
      })

      describe('Method “sumFiles()”', function () {
        it('Integration', function () {
          assert.strictEqual(countTree.sumFiles(), 9)
        })

        it('one', function () {
          const countTree = new PianoFilesCountTree(fakeSongs({ 1: 1 }))
          assert.strictEqual(countTree.sumFiles(), 1)
        })

        it('many', function () {
          const countTree = new PianoFilesCountTree(fakeSongs({ 1: 1, 2: 2, 3: 3, 4: 4 }))
          assert.strictEqual(countTree.sumFiles(), 30)
        })

        it('empty', function () {
          const countTree = new PianoFilesCountTree([])
          assert.strictEqual(countTree.sumFiles(), 0)
        })
      })

      describe('Method “isEmpty()”', function () {
        it('Integration', function () {
          assert.strictEqual(countTree.isEmpty(), false)
        })

        it('true', function () {
          const countTree = new PianoFilesCountTree([])
          assert.strictEqual(countTree.isEmpty(), true)
        })

        it('false', function () {
          const countTree = new PianoFilesCountTree(fakeSongs({ 1: 1 }))
          assert.strictEqual(countTree.isEmpty(), false)
        })
      })

      describe('Method “shift()”', function () {
        it('No exception', function () {
          const countTree = new PianoFilesCountTree(songs)
          const song1 = countTree.shift(1)
          assert.strictEqual(song1.metaData.title, 'Stille Nacht')
          const song2 = countTree.shift(1)
          assert.strictEqual(song2, undefined)
        })

        it('No songs anymore in count category', function () {
          const countTree = new PianoFilesCountTree(songs)
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

    describe('Class “IntermediateLibrary()”', function () {
      const IntermediateLibrary = intermediateRewired.__get__('IntermediateLibrary')
      let library
      let basePath

      beforeEach(function () {
        basePath = mkTmpDir()
        fs.copySync(path.join(__dirname, 'songs', 'processed', 'some'), basePath)
        library = new IntermediateLibrary(basePath)
      })

      describe('Properties', function () {
        it('Property “projectorPath”', function () {
          assert.strictEqual(library.projectorPath, undefined)
        })

        it('Property “pianoPath”', function () {
          assert.strictEqual(library.pianoPath, undefined)
        })

        it('Properties “projectorPath” and “pianoPath”', function () {
          const projectorPath = mkTmpDir()
          const pianoPath = mkTmpDir()
          library = new IntermediateLibrary(
            basePath,
            projectorPath,
            pianoPath
          )
          assert.strictEqual(typeof library.projectorPath, 'string')
          assert.strictEqual(typeof library.pianoPath, 'string')
        })

        it('Property “fileMonitor”', function () {
          const FileMonitor = intermediateRewired.__get__('FileMonitor')
          assert.ok(library.fileMonitor instanceof FileMonitor)
        })

        it('Property “songs”', function () {
          assert.strictEqual(library.songs['Auf-der-Mauer'].songID, 'Auf-der-Mauer')
        })
      })

      describe('Methods', function () {
        it('Method “gitPull()”', function () {
          assert.ok(!library.gitPull())
        })

        it('Method “collectSongs_()”', function () {
          assert.strictEqual(library.detectSongs_().length, 4)
          const songs = library.collectSongs_()
          assert.strictEqual(songs['Auf-der-Mauer'].songID, 'Auf-der-Mauer')
        })

        describe('Method “deleteFiles_()”', function () {

        })

        it('Method “cleanIntermediateFiles()”', function () {
          const tmpDir = mkTmpDir()
          fs.copySync(basePath, tmpDir)
          const library = new IntermediateLibrary(tmpDir)
          library.cleanIntermediateFiles()
          assert.ok(!fs.existsSync(path.join(library.basePath, 'songs.tex')))
        })

        describe('Method “generateIntermediateFiles()”', function () {
          it('force = false', function () {
            const spy = sinon.spy()
            const stub = sinon.stub()
            intermediateRewired.__set__('message.songFolder', stub)
            const library = new IntermediateLibrary(basePath)
            for (const songID in library.songs) {
              library.songs[songID].generateIntermediateFiles = spy
            }
            library.generateIntermediateFiles('all', false)
            assert.strictEqual(spy.callCount, 4)
            assert.ok(spy.calledWith('all', false))
            stub()
          })

          it('force = true', function () {
            const spy = sinon.spy()
            const stub = sinon.stub()
            intermediateRewired.__set__('message.songFolder', stub)
            const library = new IntermediateLibrary(basePath)
            for (const songID in library.songs) {
              library.songs[songID].generateIntermediateFiles = spy
            }
            library.generateIntermediateFiles('all', true)
            assert.ok(spy.calledWith('all', true))
            stub()
          })
        })

        describe('Method “updateSongByPath()”', function () {
          it('No exception', function () {
            const clean = path.join(__dirname, 'songs', 'clean', 'some')
            library = new IntermediateLibrary(clean)
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
            const clean = path.join(__dirname, 'songs', 'clean', 'some')
            library = new IntermediateLibrary(clean)
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
          const stub = sinon.stub()
          intermediateRewired.__set__('message.songFolder', stub)

          const songs = path.join(__dirname, 'songs', 'clean', 'some')

          const buildFolderList = function (basePath) {
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
            const tmpDir = mkTmpDir()
            fs.copySync(songs, tmpDir)
            const library = new IntermediateLibrary(tmpDir)
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
            const stub = sinon.stub()
            intermediateRewired.__set__('message.songFolder', stub)

            const songs = path.join(__dirname, 'songs', 'clean', 'some')
            const auf = path.join(songs, 'a', 'Auf-der-Mauer')
            const swing = path.join(songs, 's', 'Swing-low')
            const zum = path.join(songs, 'z', 'Zum-Tanze-da-geht-ein-Maedel')
            const folders = [auf, swing, zum]

            const library = new IntermediateLibrary(songs)
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
            const tmpDir = mkTmpDir()
            fs.copySync(songs, tmpDir)
            const library = new IntermediateLibrary(tmpDir)
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
})
