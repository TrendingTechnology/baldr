const assert = require('assert')
const fs = require('fs-extra')
const indexRewired = require('rewire')('../index.js')
const path = require('path')
const process = require('process')
const sinon = require('sinon')
const spawn = require('child_process').spawnSync
const standard = require('mocha-standard')
const tmp = require('tmp')

process.env.PATH = path.join(__dirname, 'bin:', process.env.PATH)
process.env.BALDR_SONGBOOK_PATH = path.resolve('test', 'songs', 'clean', 'some')

let assertExists = function () {
  assert.ok(
    fs.existsSync(
      path.join.apply(null, arguments)
    )
  )
}

let assertNotExists = function () {
  assert.ok(
    !fs.existsSync(
      path.join.apply(null, arguments)
    )
  )
}

let mkTmpDir = function () {
  return tmp.dirSync().name
}

let mkTmpFile = function () {
  return tmp.fileSync().name
}

let bootstrapConfig = indexRewired.__get__('bootstrapConfig')
bootstrapConfig({
  test: true,
  path: path.resolve('test', 'songs', 'clean', 'some'),
  force: true
})

describe('Class “Message()”', () => {
  let Message = indexRewired.__get__('Message')
  let message = indexRewired.__get__('message')
  let Song = indexRewired.__get__('Song')
  let song = new Song(path.resolve('test', 'songs', 'processed', 'some', 'a', 'Auf-der-Mauer_auf-der-Lauer'))

  const status = {
    'changed': {
      'piano': false,
      'slides': false
    },
    'folder': 'songs/a/Auf-der-Mauer_auf-der-Lauer',
    'folderName': 'Auf-der-Mauer_auf-der-Lauer',
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
    assert.strictEqual(String(stub.args[0]), String(output))
  }

  it('Method “print()”', () => {
    let stub = sinon.stub()
    let message = new Message()
    message.print = stub
    message.print('lol')
    assert.strictEqual(stub.called, true)
  })

  it('const “error”', () => {
    assert.strictEqual(message.error, '\u001b[31m☒\u001b[39m')
  })

  it('const “finished”', () => {
    assert.strictEqual(message.finished, '\u001b[32m☑\u001b[39m')
  })

  it('const “progress”', () => {
    assert.strictEqual(message.progress, '\u001b[33m☐\u001b[39m')
  })

  it('function “noConfigPath()”', () => {
    let stub = sinon.stub()
    let message = new Message()
    message.print = stub

    try {
      message.noConfigPath()
    } catch (e) {
      assert.strictEqual(e.message, 'No configuration file found.')
    }
    assert.strictEqual(stub.called, true)
    assert.deepStrictEqual(stub.args, [
      [ '\u001b[31m☒\u001b[39m  Configuration file “~/.baldr.json” not found!\nCreate such a config file or use the “--path” option!\n\nExample configuration file:\n{\n\t"songbook": {\n\t\t"path": "/home/jf/songs"\n\t}\n}\n' ]
    ])
  })

  describe('function “songFolder()”', () => {
    it('finished', () => {
      let finished = clone(status)
      assertSongFolder(
        finished,
        '\u001b[32m☑\u001b[39m  \u001b[32mAuf-der-Mauer_auf-der-Lauer\u001b[39m: Auf der Mauer, auf der Lauer'
      )
    })

    it('progress', () => {
      let progress = clone(status)
      progress.changed.slides = true
      assertSongFolder(
        progress,
        '\u001b[33m☐\u001b[39m  \u001b[33mAuf-der-Mauer_auf-der-Lauer\u001b[39m: Auf der Mauer, auf der Lauer'
      )
    })

    it('forced', () => {
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
        '\u001b[32m☑\u001b[39m  \u001b[32mAuf-der-Mauer_auf-der-Lauer\u001b[39m: Auf der Mauer, auf der Lauer \u001b[31m(forced)\u001b[39m\n\t\u001b[33mslides\u001b[39m: 01.svg, 02.svg\n\t\u001b[33mpiano\u001b[39m: piano_1.eps, piano_2.eps'
      )
    })

    it('generatedPiano', () => {
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
        '\u001b[33m☐\u001b[39m  \u001b[33mAuf-der-Mauer_auf-der-Lauer\u001b[39m: Auf der Mauer, auf der Lauer\n\t\u001b[33mpiano\u001b[39m: piano_1.eps, piano_2.eps'
      )
    })

    it('generatedSlides', () => {
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
        '\u001b[33m☐\u001b[39m  \u001b[33mAuf-der-Mauer_auf-der-Lauer\u001b[39m: Auf der Mauer, auf der Lauer\n\t\u001b[33mslides\u001b[39m: 01.svg, 02.svg'
      )
    })
  })
})

describe('Class “TeXFile()”', () => {
  let TeXFile = indexRewired.__get__('TeXFile')

  it('Method “append()”', function () {
    let texFile = new TeXFile(mkTmpFile())
    texFile.append('test')
  })

  it('Method “remove()”', function () {
    let texFile = new TeXFile(mkTmpFile())
    assertExists(texFile.path)
    texFile.remove()
    assertNotExists(texFile.path)
  })

  it('Method “flush()”', function () {
    let texFile = new TeXFile(mkTmpFile())
    texFile.append('test')
    texFile.flush('test')
    assert.strictEqual(texFile.read(), '')
  })

  it('Method “read()”', function () {
    let texFile = new TeXFile(mkTmpFile())
    texFile.append('test')
    assert.strictEqual(texFile.read(), 'test')
  })
})

describe('File “index.js”', () => {
  describe('Configuration', () => {
    it('Function “bootstrapConfig()”', () => {
      let bootstrapConfig = indexRewired.__get__('bootstrapConfig')
      let config = bootstrapConfig({ path: path.resolve('test', 'songs', 'clean', 'some'), test: true })
      assert.strictEqual(config.path, path.resolve('test', 'songs', 'clean', 'some'))
    })

    it('Function “bootstrapConfig()”: exit', () => {
      let savePATH = process.env.PATH
      process.env.PATH = ''
      try {
        let bootstrapConfig = indexRewired.__get__('bootstrapConfig')
        bootstrapConfig({ path: path.resolve('test', 'songs', 'clean', 'some'), test: true })
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
})

it('Conforms to standard', standard.files([
  '*.js', 'test/*.js'
]))

describe('Command line interface', () => {
  const baseArgv = [
    '/usr/bin/node',
    path.join(path.resolve('.'), 'index.js')
  ]

  const invokeCommand = function (argv) {
    let main = indexRewired.__get__('main')
    indexRewired.__set__('process.argv', baseArgv.concat(argv))
    main()
    return indexRewired
  }

  const read = function (file) {
    return fs.readFileSync(file, 'utf-8')
  }

  describe('Require as module', () => {
    it('--path', () => {
      const indexRewired = require('rewire')('../index.js')
      let Message = indexRewired.__get__('Message')
      let message = new Message()
      let stub = sinon.stub()
      message.print = stub
      indexRewired.__set__('message', message)

      let main = indexRewired.__get__('main')
      indexRewired.__set__('process.argv', [
        '', '', '--path', path.join('test', 'songs', 'clean', 'some')
      ])
      main()

      let commander = indexRewired.__get__('commander')
      assert.strictEqual(commander.path, path.join('test', 'songs', 'clean', 'some'))
      assert.deepStrictEqual(
        stub.args,
        [
          [ '\u001b[33m☐\u001b[39m  \u001b[33mAuf-der-Mauer_auf-der-Lauer\u001b[39m: Auf der Mauer, auf der Lauer\n\t\u001b[33mslides\u001b[39m: 01.svg, 02.svg\n\t\u001b[33mpiano\u001b[39m: piano_1.eps, piano_2.eps' ],
          [ '\u001b[33m☐\u001b[39m  \u001b[33mStille-Nacht\u001b[39m: Stille Nacht\n\t\u001b[33mslides\u001b[39m: 01.svg, 02.svg\n\t\u001b[33mpiano\u001b[39m: piano_1.eps, piano_2.eps' ],
          [ '\u001b[33m☐\u001b[39m  \u001b[33mSwing-low\u001b[39m: Swing low\n\t\u001b[33mslides\u001b[39m: 01.svg, 02.svg\n\t\u001b[33mpiano\u001b[39m: piano_1.eps, piano_2.eps' ],
          [ '\u001b[33m☐\u001b[39m  \u001b[33mZum-Tanze-da-geht-ein-Maedel\u001b[39m: Zum Tanze, da geht ein Mädel\n\t\u001b[33mslides\u001b[39m: 01.svg, 02.svg\n\t\u001b[33mpiano\u001b[39m: piano_1.eps, piano_2.eps' ]
        ]
      )
    })

    it('--tex', () => {
      invokeCommand(['--path', path.join('test', 'songs', 'processed', 'one'), '--tex'])
      let tex = path.join('test', 'songs', 'processed', 'one', 'songs.tex')

      assertExists(tex)
      assert.strictEqual(
        read(tex),
        read(path.join('test', 'files', 'songs_min_processed.tex'))
      )
      fs.unlinkSync(tex)
    })

    it('--folder', () => {
      const indexRewired = require('rewire')('../index.js')
      let Message = indexRewired.__get__('Message')
      let message = new Message()
      let stub = sinon.stub()
      message.print = stub
      indexRewired.__set__('message', message)

      let main = indexRewired.__get__('main')
      indexRewired.__set__('process.argv', [
        '', '',
        '--folder',
        'test/songs/clean/some/a/Auf-der-Mauer_auf-der-Lauer'
      ])
      main()
      let output = stub.args[0][0]
      assert.ok(output.includes('Auf-der-Mauer_auf-der-Lauer'))
      assert.ok(output.includes('01.svg, 02.svg'))
      assert.ok(output.includes('piano_1.eps, piano_2.eps'))
    })
  })

  describe('Command line', () => {
    it('no arguments: normal update', () => {
      spawn('./index.js')
    })

    it('no arguments (second run): only json and TeX generation', () => {
      spawn('./index.js')
    })

    it('--force', () => {
      spawn('./index.js', ['--force'])
    })

    it('--help', () => {
      const cli = spawn('./index.js', ['--help'])
      let out = cli.stdout.toString()
      assert.ok(out.indexOf('Usage') > -1)
      assert.ok(out.indexOf('--help') > -1)
      assert.ok(out.indexOf('--version') > -1)
      assert.strictEqual(cli.status, 0)
    })

    it('--version', () => {
      const cli = spawn('./index.js', ['--version'])
      let pckg = require('../package.json')
      assert.strictEqual(cli.stdout.toString(), pckg.version + '\n')
      assert.strictEqual(cli.status, 0)
    })

    // Test should be executed at the very last position.
    it('--clean', () => {
      spawn('./index.js', ['--clean'])
    })
  })
})

describe('Class “SongMetaData()”', function () {
  let songPath = path.resolve('test', 'songs', 'clean', 'some', 'a', 'Auf-der-Mauer_auf-der-Lauer')
  let SongMetaData = indexRewired.__get__('SongMetaData')

  it('Exception: No song folder', function () {
    assert.throws(
      () => {
        return new SongMetaData('lol')
      },
      /^.*Song folder doesn’t exist: lol.*$/
    )
  })

  it('Exception: No yaml file', function () {
    let tmpDir = mkTmpDir()
    assert.throws(
      () => {
        return new SongMetaData(tmpDir)
      },
      /^.*YAML file could not be found: .*$/
    )
  })

  it('on regular song folder', function () {
    let song = new SongMetaData(songPath)
    assert.strictEqual(song.title, 'Auf der Mauer, auf der Lauer')
  })

  it('Exception: Unsupported key', function () {
    assert.throws(
      () => {
        return new SongMetaData(path.join('test', 'files', 'wrong-song-yaml'))
      },
      /^.*Unsupported key: lol.*$/
    )
  })
})

describe('Class “Sqlite()”', () => {
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

  it('Object “Sqlite()”', () => {
    assert.ok(db)
  })

  it('test.db exists', () => {
    assertExists(testDb)
  })

  it('Method “insert()”', () => {
    db.insert('lol', 'toll')
    let row = db.select('lol')
    assert.strictEqual(row.hash, 'toll')
  })

  it('Error', () => {
    try {
      db.insert('lol', 'toll')
      db.insert('lol', 'toll')
    } catch (e) {
      assert.strictEqual(e.name, 'SqliteError')
    }
  })

  it('Method “update()”', () => {
    db.insert('lol', 'toll')
    db.update('lol', 'troll')
    assert.strictEqual(db.select('lol').hash, 'troll')
  })
})

describe('Class “FileMonitor()”', () => {
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

  it('Method “hashSHA1()”', () => {
    assert.strictEqual(
      monitor.hashSHA1(path.join('test', 'files', 'hash.txt')),
      '7516f3c75e85c64b98241a12230d62a64e59bce3'
    )
  })

  it('dbFile exists', () => {
    assert.strictEqual(monitor.db.dbFile, testDb)
  })

  it('File modified', () => {
    fs.appendFileSync(testFile, 'test')
    assert.ok(monitor.isModified(testFile))
  })

  it('File not modified', () => {
    fs.appendFileSync(testFile, 'test')
    assert.ok(monitor.isModified(testFile))
    assert.ok(!monitor.isModified(testFile))
    assert.ok(!monitor.isModified(testFile))
  })

  it('File twice modified', () => {
    fs.appendFileSync(testFile, 'test')
    assert.ok(monitor.isModified(testFile))
    fs.appendFileSync(testFile, 'test')
    assert.ok(monitor.isModified(testFile))
  })

  it('Method “purge()”', () => {
    monitor.purge()
    assert.ok(!fs.existsSync(testDb))
  })

  it('Method “purge()”: call multiple times', () => {
    monitor.purge()
    assert.ok(!fs.existsSync(testDb))
    monitor.purge()
    assert.ok(!fs.existsSync(testDb))
  })
})

describe('Class “SongFiles()”', function () {
  let SongFiles = indexRewired.__get__('SongFiles')
  let FileMonitor = indexRewired.__get__('FileMonitor')
  let folder = path.join('test', 'songs', 'clean', 'some', 'a', 'Auf-der-Mauer_auf-der-Lauer')
  let fileMonitor = new FileMonitor(mkTmpFile())
  let songFiles = new SongFiles(folder, fileMonitor)

  afterEach(function () {
    fileMonitor.flush()
  })

  describe('Private function “detectFile_()”', () => {
    it('Exception', function () {
      assert.throws(
        () => {
          songFiles.detectFile_('xxx')
        },
        /^.*File doesn’t exist: .*$/
      )
    })

    it('Exception by two files', function () {
      assert.throws(
        () => {
          songFiles.detectFile_('xxx', 'yyy')
        },
        /^.*File doesn’t exist: .*$/
      )
    })

    it('Return value', function () {
      let result = songFiles.detectFile_('projector.mscx')
      assert.ok(result.includes('projector.mscx'))
    })

    it('Return value by two files', function () {
      let result = songFiles.detectFile_('xxx.mscx', 'projector.mscx')
      assert.ok(result.includes('projector.mscx'))
    })

    it('Return value by two files, get first', function () {
      let result = songFiles.detectFile_('projector.mscx', 'xxx.mscx')
      assert.ok(result.includes('projector.mscx'))
    })
  })

  describe('Method “generateIntermediateFiles()”', () => {
    it('First run', function () {
      let status = songFiles.generateIntermediateFiles()
      assert.deepStrictEqual(
        status,
        {
          'changed': {
            'piano': true,
            'slides': true
          },
          'folder': 'test/songs/clean/some/a/Auf-der-Mauer_auf-der-Lauer',
          'folderName': 'Auf-der-Mauer_auf-der-Lauer',
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
      songFiles.generateIntermediateFiles()
      let status = songFiles.generateIntermediateFiles()
      assert.strictEqual(status.changed.piano, false)
      assert.strictEqual(status.changed.slides, false)
    })

    it('force', function () {
      let status = songFiles.generateIntermediateFiles(true)
      assert.strictEqual(status.force, true)
    })
  })

  describe('Method “getFolderFiles_()”', () => {
    let folder = path.join('test', 'songs', 'processed', 'one', 'a', 'Auf-der-Mauer_auf-der-Lauer')
    let songFiles = new SongFiles(folder)

    it('Method “getFolderFiles_()”: eps', () => {
      const files = songFiles.getFolderFiles_('piano', '.eps')
      assert.deepStrictEqual(files, ['piano.eps'])
    })

    it('Method “getFolderFiles_()”: svg', () => {
      const files = songFiles.getFolderFiles_('slides', '.svg')
      assert.deepStrictEqual(files, ['01.svg'])
    })

    it('Method “getFolderFiles_()”: non existent folder', () => {
      const files = songFiles.getFolderFiles_('lol', '.svg')
      assert.deepStrictEqual(files, [])
    })

    it('Method “getFolderFiles_()”: empty folder', () => {
      const empty = path.join('test', 'files', 'empty')
      fs.mkdirSync(empty)
      const files = songFiles.getFolderFiles_('empty', '.svg')
      assert.deepStrictEqual(files, [])
      fs.rmdirSync(empty)
    })
  })

  it('Method “generatePDF_()”', () => {
    let file = songFiles.generatePDF_('projector', 'projector')
    assert.strictEqual(file, 'projector.pdf')
    assertExists(folder, 'projector.pdf')
  })

  it('Method “generateSlides_()”', () => {
    songFiles.generatePDF_('projector')
    const slides = path.join(folder, 'slides')
    let files = songFiles.generateSlides_(folder)

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

  describe('Method “generatePiano_()”', () => {
    it('lead', () => {
      let folderSwing = path.join('test', 'songs', 'clean', 'some', 's', 'Swing-low')
      let songFilesSwing = new SongFiles(folderSwing, fileMonitor)
      let files = songFilesSwing.generatePiano_()

      assert.deepStrictEqual(files, [ 'piano_1.eps', 'piano_2.eps' ])

      let result = [
        [folderSwing, 'piano'],
        [folderSwing, 'piano', 'piano.mscx'],
        [folderSwing, 'piano', 'piano_1.eps']
      ]
      result.forEach(args => { assertExists(...args) })

      fs.removeSync(path.join(folder, 'piano'))
    })

    it('piano', () => {
      let files = songFiles.generatePiano_()

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

  it('Method “cleanIntermediateFiles()”', () => {
    songFiles.generateIntermediateFiles()
    assert.ok(fs.existsSync(path.join(songFiles.folder, 'projector.pdf')))
    songFiles.cleanIntermediateFiles()
    assert.ok(!fs.existsSync(path.join(songFiles.folder, 'projector.pdf')))
  })
})

it('Function “texCmd()”', () => {
  let texCmd = indexRewired.__get__('texCmd')
  assert.strictEqual(texCmd('lorem', 'ipsum'), '\\tmplorem{ipsum}\n')
})

describe('Function “checkExecutable()”', () => {
  let checkExecutable = indexRewired.__get__('checkExecutable')

  it('Function “checkExecutable()”: existing executable', () => {
    assert.strictEqual(checkExecutable('echo'), true)
  })

  it('Function “checkExecutable()”: nonexisting executable', () => {
    assert.strictEqual(checkExecutable('loooooool'), false)
  })
})

describe('Function “checkExecutables()”', () => {
  let checkExecutables = indexRewired.__get__('checkExecutables')

  it('all are existing', () => {
    let { status, unavailable } = checkExecutables(['echo', 'ls'])
    assert.strictEqual(status, true)
    assert.deepStrictEqual(unavailable, [])
  })

  it('one executable', () => {
    let { status, unavailable } = checkExecutables(['echo'])
    assert.strictEqual(status, true)
    assert.deepStrictEqual(unavailable, [])
  })

  it('one nonexisting executable', () => {
    let { status, unavailable } = checkExecutables(['echo', 'loooooool'])
    assert.strictEqual(status, false)
    assert.deepStrictEqual(unavailable, ['loooooool'])
  })

  it('two nonexisting executable', () => {
    let { status, unavailable } = checkExecutables(['troooooool', 'loooooool'])
    assert.strictEqual(status, false)
    assert.deepStrictEqual(unavailable, ['troooooool', 'loooooool'])
  })

  it('without arguments', () => {
    let { status, unavailable } = checkExecutables()
    assert.strictEqual(status, true)
    assert.deepStrictEqual(unavailable, [])
  })
})

describe('Class “SongMetaData”', () => {
  let SongMetaDataCombined = indexRewired.__get__('SongMetaDataCombined')

  describe('get title', () => {
    it('title only', () => {
      let song = new SongMetaDataCombined({ 'title': 'lol' })
      assert.strictEqual(song.title, 'lol')
    })
    it('title and year', () => {
      let song = new SongMetaDataCombined({ 'title': 'lol', 'year': 1984 })
      assert.strictEqual(song.title, 'lol (1984)')
    })
  })

  describe('get subtitle', () => {
    it('all properties', () => {
      let song = new SongMetaDataCombined({ 'subtitle': 's', 'alias': 'a', 'country': 'c' })
      assert.strictEqual(song.subtitle, 's - a - c')
    })
    it('no properties', () => {
      let song = new SongMetaDataCombined({})
      assert.strictEqual(song.subtitle, '')
    })
  })

  describe('get composer', () => {
    it('all properties', () => {
      let song = new SongMetaDataCombined({ 'composer': 'c', 'artist': 'a', 'genre': 'g' })
      assert.strictEqual(song.composer, 'c, a, g')
    })
    it('no properties', () => {
      let song = new SongMetaDataCombined({})
      assert.strictEqual(song.composer, '')
    })
  })

  describe('Real world example', () => {
    let SongMetaData = indexRewired.__get__('SongMetaData')
    let folder = path.join('test', 'songs', 'clean', 'some', 'a', 'Auf-der-Mauer_auf-der-Lauer')
    let metaData = new SongMetaData(folder)
    let combined = new SongMetaDataCombined(metaData)
    it('title', () => {
      assert.strictEqual(combined.title, 'Auf der Mauer, auf der Lauer')
    })
    it('subtitle', () => {
      assert.strictEqual(combined.subtitle, 'Deutschland')
    })
    it('composer', () => {
      assert.strictEqual(combined.composer, '')
    })
    it('lyricist', () => {
      assert.strictEqual(combined.lyricist, '')
    })
  })
})

describe('Class “Song()”', function () {
  let Song = indexRewired.__get__('Song')
  let folder = path.join('test', 'songs', 'clean', 'some', 'a', 'Auf-der-Mauer_auf-der-Lauer')
  let song = new Song(folder)

  it('Initialisation with a directory', function () {
    let song = new Song(folder)
    assert.strictEqual(song.folder, folder)
  })

  it('Initialisation with info.yml', function () {
    let song = new Song(path.join(folder, 'info.yml'))
    assert.strictEqual(song.folder, folder)
  })

  it('Initialisation with projector.mscx', function () {
    let song = new Song(path.join(folder, 'projector.mscx'))
    assert.strictEqual(song.folder, folder)
  })

  it('Property “songID”', function () {
    assert.strictEqual(song.songID, 'Auf-der-Mauer_auf-der-Lauer')
  })

  it('Property “metaData”', function () {
    let SongMetaData = indexRewired.__get__('SongMetaData')
    assert.ok(song.metaData instanceof SongMetaData)
  })

  it('Property “metaDataCombined”', function () {
    let SongMetaDataCombined = indexRewired.__get__('SongMetaDataCombined')
    assert.ok(song.metaDataCombined instanceof SongMetaDataCombined)
  })

  it('Property “files”', function () {
    let SongFiles = indexRewired.__get__('SongFiles')
    assert.ok(song.files instanceof SongFiles)
  })

  it('Method “normalizeSongFolder_(): folder”', function () {
    assert.strictEqual(song.normalizeSongFolder_(folder), folder)
  })

  it('Method “normalizeSongFolder_(): file', function () {
    assert.strictEqual(song.normalizeSongFolder_(path.join(folder, 'info.yml')), folder)
  })

  it('Method “recognizeABCFolder_(): file', function () {
    assert.strictEqual(song.recognizeABCFolder_(folder), 'a')
  })

  it('Method “formatPianoTex()”', () => {
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
})

describe('Class “Library()”', () => {
  let Library = indexRewired.__get__('Library')
  let folder = path.join('test', 'songs', 'processed', 'some')
  let library = new Library(folder)

  it('Method “detectSongs_()”', () => {
    assert.strictEqual(library.detectSongs_().length, 4)
  })

  it('Method “gitPull()”', () => {
    assert.ok(!library.gitPull())
  })

  it('Property “songs”', () => {
    assert.strictEqual(library.songs['Auf-der-Mauer_auf-der-Lauer'].songID, 'Auf-der-Mauer_auf-der-Lauer')
  })

  it('Exceptions', () => {
    let folder = path.join('test', 'songs', 'processed')
    assert.throws(
      () => {
        return new Library(folder)
      },
      /^.*A song with the same songID already exists: Auf-der-Mauer_auf-der-Lauer$/
    )
  })

  it('Method “getSongById()”', () => {
    assert.strictEqual(library.getSongById('Auf-der-Mauer_auf-der-Lauer').metaData.title, 'Auf der Mauer, auf der Lauer')
  })

  it('Method “getSongById()”: Exception', () => {
    assert.throws(
      () => {
        return library.getSongById('test')
      },
      /^.*There is no song with the songID: test$/
    )
  })

  it('Method “getABCFolders_()”', () => {
    let folders = library.getABCFolders_()
    assert.strictEqual(folders.length, 3)
    assert.deepStrictEqual(folders, ['a', 's', 'z'])
  })

  it('Method “buildAlphabeticalSongTree()”', () => {
    let folderTree = library.buildAlphabeticalSongTree()
    assert.deepStrictEqual(
      folderTree.a[0].songID,
      'Auf-der-Mauer_auf-der-Lauer')
    assert.deepStrictEqual(
      folderTree.s[0].songID,
      'Stille-Nacht')
  })

  it('Method “cleanIntermediateFiles()”', () => {
    let tmpDir = mkTmpDir()
    fs.copySync(folder, tmpDir)
    let library = new Library(tmpDir)
    library.cleanIntermediateFiles()
    assert.ok(!fs.existsSync(path.join(library.basePath, 'songs.tex')))
  })

  it('Method “generateIntermediateFiles(force = false)”', () => {
    let spy = sinon.spy()
    let stub = sinon.stub()
    indexRewired.__set__('message.songFolder', stub)
    let library = new Library(folder)
    for (let songID in library.songs) {
      library.songs[songID].files.generateIntermediateFiles = spy
    }
    library.generateIntermediateFiles(false)
    assert.strictEqual(spy.callCount, 4)
    assert.ok(spy.calledWith(false))
    stub()
  })

  it('Method “generateIntermediateFiles(force = true)”', () => {
    let spy = sinon.spy()
    let stub = sinon.stub()
    indexRewired.__set__('message.songFolder', stub)
    let library = new Library(folder)
    for (let songID in library.songs) {
      library.songs[songID].files.generateIntermediateFiles = spy
    }
    library.generateIntermediateFiles(true)
    assert.ok(spy.calledWith(true))
    stub()
  })

  it('Method “update()”', () => {
    let stub = sinon.stub()
    indexRewired.__set__('message.songFolder', stub)

    let songs = path.join('test', 'songs', 'clean', 'some')
    const auf = path.join(songs, 'a', 'Auf-der-Mauer_auf-der-Lauer')
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

  it('Method “buildPianoFilesCountTree()”', () => {
    let count = library.buildPianoFilesCountTree()
    assert.strictEqual(count.a[3][0].metaData.title, 'Auf der Mauer, auf der Lauer')
    assert.strictEqual(count.s[1][0].metaData.title, 'Stille Nacht')
    assert.strictEqual(count.s[3][0].metaData.title, 'Swing low')
    assert.strictEqual(count.z[2][0].metaData.title, 'Zum Tanze, da geht ein Mädel')
  })

  it('Method “generateTeX()”', () => {
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
})

describe('Class “Folder()”', function () {
  let Folder = indexRewired.__get__('Folder')

  it('Initialisation', function () {
    let tmpDir = mkTmpDir()
    let folder = new Folder(tmpDir)
    assert.strictEqual(folder.folderPath, tmpDir)
  })

  it('Initialisation with two arguments', function () {
    let tmpDir = mkTmpDir()
    let folder = new Folder(tmpDir, 'test')
    assert.strictEqual(folder.folderPath, path.join(tmpDir, 'test'))
  })

  it('Method “remove()”', function () {
    let tmpDir = mkTmpDir()
    let folder = new Folder(tmpDir)
    folder.remove()
    assert.ok(!fs.existsSync(folder.folderPath))
  })

  it('Method “empty()”', function () {
    let tmpDir = mkTmpDir()
    let folder = new Folder(tmpDir)
    folder.empty()
    assert.ok(fs.existsSync(folder.folderPath))
  })
})
