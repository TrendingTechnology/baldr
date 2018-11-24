const { assert } = require('./lib/helper.js')
const spawn = require('child_process').spawnSync
const rewire = require('rewire')
const indexRewired = require('rewire')('../index.js')
const path = require('path')
const fs = require('fs')
const sinon = require('sinon')
process.env.PATH = path.join(__dirname, '/bin:', process.env.PATH)

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
      assert.equal(out.clean, true)
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
      assert.equal(commander.path, path.join('test', 'songs', 'clean', 'some'))
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
      assert.equal(
        read(tex),
        read(path.join('test', 'files', 'songs_min_processed.tex'))
      )
      fs.unlinkSync(tex)
    })

    it('--json', () => {
      invokeCommand(['--path', path.join('test', 'songs', 'processed', 'one'), '--json'])
      let json = path.join('test', 'songs', 'processed', 'one', 'songs.json')
      assert.exists(json)
      assert.equal(
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
      assert.equal(cli.status, 0)
    })

    it('--version', () => {
      const cli = spawn('./index.js', ['--test', '--version'])
      let pckg = require('../package.json')
      assert.equal(cli.stdout.toString(), pckg.version + '\n')
      assert.equal(cli.status, 0)
    })

    // Test should be executed at the very last position.
    it('--clean', () => {
      spawn('./index.js', ['--test', '--clean'])
    })
  })
})
