const { assert } = require('./lib/helper.js')
const CheckChange = require('../check.js')
const checkRewired = require('rewire')('../check.js')
const fs = require('fs-extra')
const indexRewired = require('rewire')('../index.js')
const json = require('../json.js')
const path = require('path')
const process = require('process')
const rewire = require('rewire')
const sinon = require('sinon')
const spawn = require('child_process').spawnSync
const standard = require('mocha-standard')

process.env.PATH = path.join(__dirname, 'bin:', process.env.PATH)

let bootstrapConfig = indexRewired.__get__('bootstrapConfig')
bootstrapConfig({
  test: true,
  path: path.resolve('test', 'songs', 'clean', 'some'),
  force: true
})

describe('file “check.js”', () => {
  it('object “Sqlite()”', () => {
    let Sqlite = checkRewired.__get__('Sqlite')
    let db = new Sqlite('test.db')

    db.initialize()
    assert.exists('test.db')

    db.insert('lol', 'toll')
    var row = db.select('lol')
    assert.strictEqual(row.hash, 'toll')

    try {
      db.insert('lol', 'toll')
    } catch (e) {
      assert.strictEqual(e.name, 'SqliteError')
    }

    db.update('lol', 'troll')
    assert.strictEqual(db.select('lol').hash, 'troll')

    fs.unlinkSync('test.db')
  })

  it('function “hashSHA1()”', () => {
    let hashSHA1 = checkRewired.__get__('hashSHA1')
    assert.strictEqual(
      hashSHA1(path.join('test', 'files', 'hash.txt')),
      '7516f3c75e85c64b98241a12230d62a64e59bce3'
    )
  })

  it('object “CheckChange()”', () => {
    var check = new CheckChange()
    check.init('test.db')
    assert.strictEqual(check.db.dbFile, 'test.db')

    fs.appendFileSync('tmp.txt', 'test')
    assert.ok(check.do('tmp.txt'))

    assert.ok(!check.do('tmp.txt'))
    assert.ok(!check.do('tmp.txt'))

    fs.appendFileSync('tmp.txt', 'test')
    assert.ok(check.do('tmp.txt'))

    fs.unlinkSync('tmp.txt')
    fs.unlinkSync('test.db')
  })
})

describe('Class “TeX”', () => {
  let TeX = indexRewired.__get__('TeX')
  let basePath = path.resolve('test', 'songs', 'processed', 'some')
  let tex = new TeX(basePath)

  it('method “buildPianoFilesCountTree()”', () => {
    let folderTree = json.readJSON(basePath)
    let count = tex.buildPianoFilesCountTree(folderTree)
    assert.strictEqual(count.a[3]['Auf-der-Mauer_auf-der-Lauer'].title, 'Auf der Mauer, auf der Lauer')
    assert.strictEqual(count.s[1]['Stille-Nacht'].title, 'Stille Nacht')
    assert.strictEqual(count.s[3]['Swing-low'].title, 'Swing low')
    assert.strictEqual(count.z[2]['Zum-Tanze-da-geht-ein-Maedel'].title, 'Zum Tanze, da geht ein Mädel')

    assert.deepEqual(count.s[3]['Swing-low'].pianoFiles, [ 'piano_1.eps', 'piano_2.eps', 'piano_3.eps' ])
  })

  it('method “texCmd()”', () => {
    assert.strictEqual(tex.texCmd('lorem', 'ipsum'), '\\tmplorem{ipsum}\n')
  })

  it('method “texABC()”', () => {
    assert.strictEqual(tex.texABC('a'), '\n\n\\tmpchapter{A}\n')
  })

  it('method “texSong()”', () => {
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

  it('method “generateTeX()”', () => {
    let texFile = path.join('test', 'songs', 'processed', 'some', 'songs.tex')
    tex.generateTeX(path.resolve('test', 'songs', 'processed', 'some'))
    assert.exists(texFile)

    var texContent = fs.readFileSync(texFile, 'utf8')
    var compare = fs.readFileSync(
      path.join('test', 'files', 'songs_processed.tex'), 'utf8'
    )

    assert.strictEqual(texContent, compare)

    assert.ok(texContent.indexOf('\\tmpimage') > -1)
    assert.ok(texContent.indexOf('\\tmpheading') > -1)
  })
})

describe('file “index.js”', () => {
  describe('Configuration', () => {
    it('function “bootstrapConfig()”', () => {
      let bootstrapConfig = indexRewired.__get__('bootstrapConfig')
      bootstrapConfig({ path: path.resolve('test', 'songs', 'clean', 'some'), test: true })
      const c = indexRewired.__get__('config')
      assert.strictEqual(c.path, path.resolve('test', 'songs', 'clean', 'some'))
      assert.exists(path.resolve('test', 'songs', 'clean', 'some', 'filehashes.db'))
    })

    it('function “bootstrapConfig()”: exit', () => {
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

  describe('Private functions', () => {
    it('function “processSongFolder()”', () => {
      let processSongFolder = indexRewired.__get__('processSongFolder')
      let status = processSongFolder(
        path.join('test', 'songs', 'clean', 'some', 'a', 'Auf-der-Mauer_auf-der-Lauer')
      )

      assert.deepEqual(
        status,
        {
          'changed': {
            'piano': true,
            'slides': true
          },
          'folder': 'test/songs/clean/some/a/Auf-der-Mauer_auf-der-Lauer',
          'folderName': 'Auf-der-Mauer_auf-der-Lauer',
          'force': true,
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
            'title': 'Auf der Mauer, auf der Lauer'
          }
        }
      )
    })
  })

  describe('Exported functions', () => {
    it('function “update()”', () => {
      let stub = sinon.stub()
      indexRewired.__set__('message.songFolder', stub)
      let update = indexRewired.__get__('update')
      update()
      let songs = path.join('test', 'songs', 'clean', 'some')
      const auf = path.join(songs, 'a', 'Auf-der-Mauer_auf-der-Lauer')
      const swing = path.join(songs, 's', 'Swing-low')
      const zum = path.join(songs, 'z', 'Zum-Tanze-da-geht-ein-Maedel')
      const folders = [auf, swing, zum]

      for (let i = 0; i < folders.length; ++i) {
        assert.exists(folders[i], 'slides')
        assert.exists(folders[i], 'slides', '01.svg')
        assert.exists(folders[i], 'piano')
        assert.exists(folders[i], 'piano', 'piano.mscx')
      }

      assert.exists(auf, 'piano', 'piano_1.eps')
      assert.exists(swing, 'piano', 'piano_1.eps')
      assert.exists(zum, 'piano', 'piano_1.eps')
      assert.exists(zum, 'piano', 'piano_2.eps')

      var info = JSON.parse(
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

    it('function “setTestMode()”', () => {
      let setTestMode = indexRewired.__get__('setTestMode')
      setTestMode()
      const config = indexRewired.__get__('config')
      assert.strictEqual(config.test, true)
      assert.strictEqual(config.path, path.resolve('test', 'songs', 'clean', 'some'))
    })

    it('function “clean()”', () => {
      let clean = indexRewired.__get__('clean')
      clean()
      assert.ok(!fs.existsSync(path.join('songs', 'songs.tex')))
    })
  })
})

it('conforms to standard', standard.files([
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

  describe('require as module', () => {
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
      assert.deepEqual(
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

      assert.exists(tex)
      assert.strictEqual(
        read(tex),
        read(path.join('test', 'files', 'songs_min_processed.tex'))
      )
      fs.unlinkSync(tex)
    })

    it('--json', () => {
      invokeCommand(['--path', path.join('test', 'songs', 'processed', 'one'), '--json'])
      let json = path.join('test', 'songs', 'processed', 'one', 'songs.json')
      assert.exists(json)
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
        '--test',
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
      spawn('./index.js', ['--test'])
    })

    it('no arguments (second run): only json and TeX generation', () => {
      spawn('./index.js', ['--test'])
    })

    it('--force', () => {
      spawn('./index.js', ['--test', '--force'])
    })

    it('--help', () => {
      const cli = spawn('./index.js', ['--test', '--help'])
      var out = cli.stdout.toString()
      assert.ok(out.indexOf('Usage') > -1)
      assert.ok(out.indexOf('--help') > -1)
      assert.ok(out.indexOf('--version') > -1)
      assert.strictEqual(cli.status, 0)
    })

    it('--version', () => {
      const cli = spawn('./index.js', ['--test', '--version'])
      let pckg = require('../package.json')
      assert.strictEqual(cli.stdout.toString(), pckg.version + '\n')
      assert.strictEqual(cli.status, 0)
    })

    // Test should be executed at the very last position.
    it('--clean', () => {
      spawn('./index.js', ['--test', '--clean'])
    })
  })
})

describe('Class Song()', function () {
  let Song = indexRewired.__get__('Song')

  it('Initialisation', function () {
    let song = new Song('lol')
    assert.ok(song)
  })
})

describe('Class SongMetaData()', function () {
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
    let tmpDir = fs.mkdtempSync('song')
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
