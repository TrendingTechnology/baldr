const assert = require('assert')
const fs = require('fs-extra')
const indexRewired = require('rewire')('../index.js')
const json = require('../json.js')
const path = require('path')
const process = require('process')
const rewire = require('rewire')
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

describe('Class “TeX()”', () => {
  let TeX = indexRewired.__get__('TeX')
  let basePath = path.resolve('test', 'songs', 'processed', 'some')
  let tex = new TeX(basePath)

  it('Method “buildPianoFilesCountTree()”', () => {
    let folderTree = json.readJSON(basePath)
    let count = tex.buildPianoFilesCountTree(folderTree)
    assert.strictEqual(count.a[3]['Auf-der-Mauer_auf-der-Lauer'].title, 'Auf der Mauer, auf der Lauer')
    assert.strictEqual(count.s[1]['Stille-Nacht'].title, 'Stille Nacht')
    assert.strictEqual(count.s[3]['Swing-low'].title, 'Swing low')
    assert.strictEqual(count.z[2]['Zum-Tanze-da-geht-ein-Maedel'].title, 'Zum Tanze, da geht ein Mädel')

    assert.deepStrictEqual(count.s[3]['Swing-low'].pianoFiles, [ 'piano_1.eps', 'piano_2.eps', 'piano_3.eps' ])
  })

  it('Method “texCmd()”', () => {
    assert.strictEqual(tex.texCmd('lorem', 'ipsum'), '\\tmplorem{ipsum}\n')
  })

  it('Method “texABC()”', () => {
    assert.strictEqual(tex.texABC('a'), '\n\n\\tmpchapter{A}\n')
  })

  it('Method “texSong()”', () => {
    let songPath = path.join(basePath, 's', 'Swing-low')
    assert.strictEqual(
      tex.texSong(songPath),
      '\n' +
      '\\tmpheading{Swing low}\n' +
      '\\tmpimage{s/Swing-low/piano/piano_1.eps}\n' +
      '\\tmpimage{s/Swing-low/piano/piano_2.eps}\n' +
      '\\tmpimage{s/Swing-low/piano/piano_3.eps}\n'
    )
  })

  it('Method “generateTeX()”', () => {
    let texFile = path.join('test', 'songs', 'processed', 'some', 'songs.tex')
    tex.generateTeX(path.resolve('test', 'songs', 'processed', 'some'))
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

describe('File “index.js”', () => {
  describe('Configuration', () => {
    it('Function “bootstrapConfig()”', () => {
      let bootstrapConfig = indexRewired.__get__('bootstrapConfig')
      bootstrapConfig({ path: path.resolve('test', 'songs', 'clean', 'some'), test: true })
      const c = indexRewired.__get__('config')
      assert.strictEqual(c.path, path.resolve('test', 'songs', 'clean', 'some'))
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

  describe('Exported functions', () => {
    it('Function “update()”', () => {
      let stub = sinon.stub()
      indexRewired.__set__('message.songFolder', stub)

      let songs = path.join('test', 'songs', 'clean', 'some')
      const auf = path.join(songs, 'a', 'Auf-der-Mauer_auf-der-Lauer')
      const swing = path.join(songs, 's', 'Swing-low')
      const zum = path.join(songs, 'z', 'Zum-Tanze-da-geht-ein-Maedel')
      const folders = [auf, swing, zum]

      let update = indexRewired.__get__('update')
      let FileMonitor = indexRewired.__get__('FileMonitor')
      update(songs, new FileMonitor(mkTmpFile()))

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

      let info = JSON.parse(
        fs.readFileSync(
          path.join(songs, 'songs.json'), 'utf8'
        )
      )
      assert.strictEqual(
        info.a['Auf-der-Mauer_auf-der-Lauer'].title,
        'Auf der Mauer, auf der Lauer'
      )

      let clean = indexRewired.__get__('clean')
      clean()
    })

    it('Function “clean()”', () => {
      let clean = indexRewired.__get__('clean')
      clean()
      assert.ok(!fs.existsSync(path.join('songs', 'songs.tex')))
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

  const args = function (arg) {
    if (typeof arg === 'string') {
      return ['-', '-', arg]
    } else {
      return ['-', '-'].concat(arg)
    }
  }

  const read = function (file) {
    return fs.readFileSync(file, 'utf-8')
  }

  describe('setOptions', () => {
    it.skip('--clean', () => {
      let setOptions = indexRewired.__get__('setOptions')
      let out = setOptions(args(['--clean']))
      console.log(out)
      assert.strictEqual(out.clean, true)
    })
  })

  describe('Require as module', () => {
    it('--path', () => {
      let stub = sinon.stub()
      let message = rewire('../message.js')
      message.__set__('info', stub)
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

    it('--json', () => {
      invokeCommand(['--path', path.join('test', 'songs', 'processed', 'one'), '--json'])
      let json = path.join('test', 'songs', 'processed', 'one', 'songs.json')
      assertExists(json)
      assert.strictEqual(
        read(json),
        read(path.join('test', 'files', 'songs_min_processed.json'))
      )
      fs.unlinkSync(json)
    })

    it('--folder', () => {
      let stub = sinon.stub()
      let message = rewire('../message.js')
      message.__set__('info', stub)
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
          },
          'info': {
            'title': 'Auf der Mauer, auf der Lauer',
            'country': 'Deutschland'
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

describe('Function “gitPull()”', () => {
  let gitPull = indexRewired.__get__('gitPull')
  assert.ok(!gitPull('songs'))
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

  it('Property “metaData”', function () {
    let SongMetaData = indexRewired.__get__('SongMetaData')
    assert.ok(song.metaData instanceof SongMetaData)
  })

  it('Property “files”', function () {
    let SongFiles = indexRewired.__get__('SongFiles')
    assert.ok(song.files instanceof SongFiles)
  })
})

describe('Class “Library()”', () => {
  let Library = indexRewired.__get__('Library')
  let folder = path.join('test', 'songs', 'processed', 'some')
  let library = new Library(folder)

  it('Method “detectSongs_()”', () => {
    assert.strictEqual(library.detectSongs_().length, 4)
  })
})
