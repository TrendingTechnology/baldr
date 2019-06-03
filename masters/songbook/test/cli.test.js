const assert = require('assert')
const path = require('path')
const spawn = require('child_process').spawnSync
const util = require('util')
const {
  assertExists,
  assertNotExists,
  removeANSI,
  read,
  tmpCopy
} = require('./_helper.js')
const cliRewired = require('rewire')('@bldr/songbook-cli')

let script = require.resolve('@bldr/songbook-cli')
let oldPath = process.env.PATH
process.env.PATH = path.join(__dirname, 'bin:', process.env.PATH)

function spawnGetTexFile (args) {
  let process = spawn(script, args, { 'encoding': 'utf-8' })
  let match = process.stdout.match(/The TeX markup was written to: (.*)/)
  if (match) {
    return match[1]
  } else {
    return false
  }
}

function getTeXMarkup (args) {
  let texFile = spawnGetTexFile(args)
  let texMarkup = read(texFile)
  texMarkup = texMarkup.replace(/^[^]*% begin song list %\n/g, '')
  texMarkup = texMarkup.replace(/\n% end song list %[^]*$/g, '')
  return texMarkup
}

describe('Package “@bldr/songbook-cli”', function () {
  describe('Function “parseCliArguments()”', function () {
    let parseCliArguments = cliRewired.__get__('parseCliArguments')
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

  describe('Command line interface', function () {
    it.skip('exit: missing dependencies', function () {
      let savePATH = process.env.PATH
      process.env.PATH = oldPath
      let tmpDir = tmpCopy('clean', 'one')
      let result = spawn(script, ['--base-path', tmpDir])
      process.env.PATH = savePATH
      assert.ok(result.status !== 0)
      let stderr = result.stderr.toString()
      assert.ok(stderr.includes('Some dependencies are not installed:'))
    })

    it('--base-path', function () {
      let tmpDir = tmpCopy('clean', 'one')
      let process = spawn(script, ['--base-path', tmpDir])
      assert.strictEqual(process.status, 0)

      let stdout = process.stdout.toString()
      assert.ok(stdout.includes(removeANSI(util.format('The base path of the song collection is located at:'))))
      // assert.ok(stdout.includes(removeANSI(util.format('The base path of the song collection is located at:\n    %s\n', tmpDir))))
      assert.ok(stdout.includes(removeANSI(util.format('Found %s songs.', 1))))
      assert.ok(stdout.includes('The TeX markup was written to: '))

      assertExists(tmpDir, 'a', 'Auf-der-Mauer', 'piano', 'piano.mscx')
      assertExists(tmpDir, 'a', 'Auf-der-Mauer', 'slides', '01.svg')
      assertExists(tmpDir, 'a', 'Auf-der-Mauer', 'projector.pdf')
    })

    it('--clean', function () {
      let tmpDir = tmpCopy('processed', 'one')
      spawn(script, ['--base-path', tmpDir, '--clean'])
      assertNotExists(tmpDir, 's', 'Swing-low', 'piano', 'piano.mscx')
    })

    it('--help', function () {
      const cli = spawn(script, ['--help'])
      let out = cli.stdout.toString()
      assert.ok(out.indexOf('Usage') > -1)
      assert.ok(out.indexOf('--help') > -1)
      assert.ok(out.indexOf('--version') > -1)
      assert.strictEqual(cli.status, 0)
    })

    it('--folder', function () {
      let tmpDir = tmpCopy('clean', 'some')
      spawn(script, ['--base-path', tmpDir, '--folder', path.join(tmpDir, 'a', 'Auf-der-Mauer')])
      assertExists(tmpDir, 'a', 'Auf-der-Mauer', 'slides', '01.svg')
    })

    it('--force', function () {
      let tmpDir = tmpCopy('clean', 'one')
      let notForced = spawn(script, ['--base-path', tmpDir])
      assert.ok(!notForced.stdout.toString().includes('(forced)'))
      let forced = spawn(script, ['--base-path', tmpDir, '--force'])
      assert.ok(forced.stdout.toString().includes('(forced)'))
    })

    it('--group-alphabetically', function () {
      let tmpDir = tmpCopy('clean', 'some')
      let texMarkup = getTeXMarkup(['--base-path', tmpDir, '--group-alphabetically', '--piano'])
      assert.strictEqual(texMarkup, `

\\tmpchapter{A}

\\tmpmetadata
{Auf der Mauer, auf der Lauer (1890)} % title
{Deutschland} % subtitle
{Georg Lehmann} % composer
{unbekannt} % lyricist
\\tmpimage{a/Auf-der-Mauer/piano/piano_1.eps}
\\tmpcolumnbreak
\\tmpimage{a/Auf-der-Mauer/piano/piano_2.eps}


\\tmpchapter{S}

\\tmpmetadata
{Stille Nacht} % title
{} % subtitle
{} % composer
{} % lyricist
\\tmpimage{s/Stille-Nacht/piano/piano_1.eps}
\\tmpcolumnbreak
\\tmpimage{s/Stille-Nacht/piano/piano_2.eps}
\\tmpcolumnbreak

\\tmpmetadata
{Swing low} % title
{} % subtitle
{} % composer
{} % lyricist
\\tmpimage{s/Swing-low/piano/piano_1.eps}
\\tmpcolumnbreak
\\tmpimage{s/Swing-low/piano/piano_2.eps}


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

    it('--list', function () {
      let tmpDir = tmpCopy('clean', 'some')
      let process = spawn(script, [
        '--base-path', tmpDir,
        '--list', path.join(__dirname, 'files', 'song-id-list.txt')
      ])
      let stdout = process.stdout.toString()
      assert.ok(stdout.includes('Auf-der-Mauer'))
      assert.ok(stdout.includes('Swing-low'))
      assert.ok(!stdout.includes('Stille-Nacht'))
    })

    it('--page-turn-optimized --group-alphabetically', function () {
      let tmpDir = tmpCopy('clean', 'some')
      let texMarkup = getTeXMarkup([
        '--base-path', tmpDir,
        '--page-turn-optimized',
        '--group-alphabetically',
        '--piano'
      ])
      assert.strictEqual(texMarkup, `

\\tmpchapter{A}

\\tmpmetadata
{Auf der Mauer, auf der Lauer (1890)} % title
{Deutschland} % subtitle
{Georg Lehmann} % composer
{unbekannt} % lyricist
\\tmpimage{a/Auf-der-Mauer/piano/piano_1.eps}
\\tmpcolumnbreak
\\tmpimage{a/Auf-der-Mauer/piano/piano_2.eps}


\\tmpchapter{S}

\\tmpmetadata
{Stille Nacht} % title
{} % subtitle
{} % composer
{} % lyricist
\\tmpimage{s/Stille-Nacht/piano/piano_1.eps}
\\tmpcolumnbreak
\\tmpimage{s/Stille-Nacht/piano/piano_2.eps}
\\tmpcolumnbreak

\\tmpmetadata
{Swing low} % title
{} % subtitle
{} % composer
{} % lyricist
\\tmpimage{s/Swing-low/piano/piano_1.eps}
\\tmpcolumnbreak
\\tmpimage{s/Swing-low/piano/piano_2.eps}


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

    it('--page-turn-optimized --group-alphabetically --list', function () {
      let tmpDir = tmpCopy('clean', 'some')
      let texMarkup = getTeXMarkup([
        '--base-path', tmpDir,
        '--page-turn-optimized',
        '--group-alphabetically',
        '--list', path.join(__dirname, 'files', 'song-id-list.txt'),
        '--piano'
      ])
      assert.strictEqual(texMarkup, `

\\tmpchapter{A}

\\tmpmetadata
{Auf der Mauer, auf der Lauer (1890)} % title
{Deutschland} % subtitle
{Georg Lehmann} % composer
{unbekannt} % lyricist
\\tmpimage{a/Auf-der-Mauer/piano/piano_1.eps}
\\tmpcolumnbreak
\\tmpimage{a/Auf-der-Mauer/piano/piano_2.eps}


\\tmpchapter{S}

\\tmpmetadata
{Swing low} % title
{} % subtitle
{} % composer
{} % lyricist
\\tmpimage{s/Swing-low/piano/piano_1.eps}
\\tmpcolumnbreak
\\tmpimage{s/Swing-low/piano/piano_2.eps}
`)
    })

    it('--page-turn-optimized', function () {
      let tmpDir = tmpCopy('clean', 'some')
      let texMarkup = getTeXMarkup([
        '--base-path', tmpDir,
        '--page-turn-optimized',
        '--piano'
      ])
      assert.strictEqual(texMarkup, `
\\tmpmetadata
{Auf der Mauer, auf der Lauer (1890)} % title
{Deutschland} % subtitle
{Georg Lehmann} % composer
{unbekannt} % lyricist
\\tmpimage{a/Auf-der-Mauer/piano/piano_1.eps}
\\tmpcolumnbreak
\\tmpimage{a/Auf-der-Mauer/piano/piano_2.eps}
\\tmpcolumnbreak

\\tmpmetadata
{Stille Nacht} % title
{} % subtitle
{} % composer
{} % lyricist
\\tmpimage{s/Stille-Nacht/piano/piano_1.eps}
\\tmpcolumnbreak
\\tmpimage{s/Stille-Nacht/piano/piano_2.eps}
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

    it('--piano', function () {
      let tmpDir = tmpCopy('clean', 'one')
      let texFile = spawnGetTexFile(['--base-path', tmpDir, '--piano'])
      assertExists(tmpDir, 'a', 'Auf-der-Mauer', 'piano', 'piano.mscx')
      assertExists(texFile)
      assertNotExists(tmpDir, 'a', 'Auf-der-Mauer', 'slides', '01.svg')
      assertNotExists(tmpDir, 'a', 'Auf-der-Mauer', 'projector.pdf')
    })

    it('--slides', function () {
      let tmpDir = tmpCopy('clean', 'one')
      let texFile = spawnGetTexFile(['--base-path', tmpDir, '--slides'])
      assertExists(tmpDir, 'a', 'Auf-der-Mauer', 'slides', '01.svg')
      assertExists(tmpDir, 'a', 'Auf-der-Mauer', 'projector.pdf')
      assertNotExists(tmpDir, 'a', 'Auf-der-Mauer', 'piano', 'piano.mscx')
      assert.ok(!texFile)
    })

    it('--song-id', function () {
      let tmpDir = tmpCopy('clean', 'some')
      spawn(script, ['--base-path', tmpDir, '--song-id', 'Auf-der-Mauer'])
      assertExists(tmpDir, 'a', 'Auf-der-Mauer', 'slides', '01.svg')
    })

    it('--version', function () {
      const cli = spawn(script, ['--version'])
      let pckg = require(path.join(__dirname, '..', 'packages', 'cli', 'package.json'))
      assert.strictEqual(cli.stdout.toString(), pckg.version + '\n')
      assert.strictEqual(cli.status, 0)
    })
  })
})
