const assert = require('assert')
const fs = require('fs')
const path = require('path')
const spawn = require('child_process').spawnSync
const util = require('util')
const {
  assertExists,
  assertNotExists,
  mkTmpDir,
  removeANSI,
  read,
  tmpCopy
} = require('./_helper.js')
const cliRewired = require('rewire')('@bldr/songbook-cli')

const script = require.resolve('@bldr/songbook-cli')
const oldPath = process.env.PATH
process.env.PATH = path.join(__dirname, 'bin:', process.env.PATH)
const argsOnlyBasePath = ['--piano-path', 'none', '--projector-path', 'none']

function spawnGetTexFile (args) {
  const process = spawn(script, args, { encoding: 'utf-8' })
  const match = process.stdout.match(/The TeX markup was written to: (.*)/)
  if (match) {
    return match[1]
  } else {
    return false
  }
}

function getTeXMarkup (args) {
  const texFile = spawnGetTexFile(args)
  let texMarkup = read(texFile)
  texMarkup = texMarkup.replace(/^[^]*% begin song list %\n/g, '')
  texMarkup = texMarkup.replace(/\n% end song list %[^]*$/g, '')
  return texMarkup
}

describe('Package “@bldr/songbook-cli”', function () {
  describe('Function “parseCliArguments()”', function () {
    const parseCliArguments = cliRewired.__get__('parseCliArguments')
    it('version', function () {
      const args = parseCliArguments(['-', '-'], '1')
      assert.strictEqual(args.version(), '1')
    })

    it('--base-path', function () {
      const args = parseCliArguments(['-', '-', '--base-path', 'lol'], '1')
      assert.strictEqual(args.basePath, 'lol')
    })

    it('--slides', function () {
      const args = parseCliArguments(['-', '-', '--slides'], '1')
      assert.strictEqual(args.slides, true)
    })

    it('no --slides', function () {
      const args = parseCliArguments(['-', '-'], '1')
      assert.strictEqual(args.slides, undefined)
    })
  })

  describe('Command line interface', function () {
    it.skip('exit: missing dependencies', function () {
      const savePATH = process.env.PATH
      process.env.PATH = oldPath
      const tmpDir = tmpCopy('clean', 'one')
      const result = spawn(script, ['--base-path', tmpDir])
      process.env.PATH = savePATH
      assert.ok(result.status !== 0)
      const stderr = result.stderr.toString()
      assert.ok(stderr.includes('Some dependencies are not installed:'))
    })

    it('--base-path', function () {
      const tmpDir = tmpCopy('clean', 'one')
      const process = spawn(script, ['--base-path', tmpDir, ...argsOnlyBasePath])
      assert.strictEqual(process.status, 0)

      const stdout = process.stdout.toString()
      assert.ok(stdout.includes(removeANSI(util.format('The base path of the song collection is located at:'))))
      // assert.ok(stdout.includes(removeANSI(util.format('The base path of the song collection is located at:\n    %s\n', tmpDir))))
      assert.ok(stdout.includes(removeANSI(util.format('Found %s songs.', 1))))
      assert.ok(stdout.includes('The TeX markup was written to: '))

      assertExists(tmpDir, 'a', 'Auf-der-Mauer', 'piano', 'piano.mscx')
      assertExists(tmpDir, 'a', 'Auf-der-Mauer', 'slides', '01.svg')
      assertNotExists(tmpDir, 'a', 'Auf-der-Mauer', 'slides', 'projector.pdf')
    })

    it('--clean', function () {
      const tmpDir = tmpCopy('processed', 'one')
      spawn(script, ['--base-path', tmpDir, '--clean'])
      assertNotExists(tmpDir, 's', 'Swing-low', 'piano', 'piano.mscx')
    })

    it('--help', function () {
      const cli = spawn(script, ['--help'])
      const out = cli.stdout.toString()
      assert.ok(out.indexOf('Usage') > -1)
      assert.ok(out.indexOf('--help') > -1)
      assert.ok(out.indexOf('--version') > -1)
      assert.strictEqual(cli.status, 0)
    })

    it('--folder', function () {
      const tmpDir = tmpCopy('clean', 'some')
      spawn(script, ['--base-path', tmpDir, '--folder', path.join(tmpDir, 'a', 'Auf-der-Mauer'), ...argsOnlyBasePath])
      assertExists(tmpDir, 'a', 'Auf-der-Mauer', 'slides', '01.svg')
    })

    it('--force', function () {
      const tmpDir = tmpCopy('clean', 'one')
      const notForced = spawn(script, ['--base-path', tmpDir, ...argsOnlyBasePath])
      assert.ok(!notForced.stdout.toString().includes('(forced)'))
      const forced = spawn(script, ['--base-path', tmpDir, '--force', ...argsOnlyBasePath])
      assert.ok(forced.stdout.toString().includes('(forced)'))
    })

    it('--group-alphabetically', function () {
      const tmpDir = tmpCopy('clean', 'some')
      const texMarkup = getTeXMarkup([
        '--base-path', tmpDir,
        '--group-alphabetically',
        '--piano',
        ...argsOnlyBasePath
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

    it('--list', function () {
      const tmpDir = tmpCopy('clean', 'some')
      const process = spawn(script, [
        '--base-path', tmpDir,
        '--list', path.join(__dirname, 'files', 'song-id-list.txt'),
        ...argsOnlyBasePath
      ])
      const stdout = process.stdout.toString()
      assert.ok(stdout.includes('Auf-der-Mauer'))
      assert.ok(stdout.includes('Swing-low'))
      assert.ok(!stdout.includes('Stille-Nacht'))
    })

    it('--page-turn-optimized --group-alphabetically', function () {
      const tmpDir = tmpCopy('clean', 'some')
      const texMarkup = getTeXMarkup([
        '--base-path', tmpDir,
        '--page-turn-optimized',
        '--group-alphabetically',
        '--piano',
        ...argsOnlyBasePath
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
      const tmpDir = tmpCopy('clean', 'some')
      const texMarkup = getTeXMarkup([
        '--base-path', tmpDir,
        '--page-turn-optimized',
        '--group-alphabetically',
        '--list', path.join(__dirname, 'files', 'song-id-list.txt'),
        '--piano',
        ...argsOnlyBasePath
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
      const tmpDir = tmpCopy('clean', 'some')
      const texMarkup = getTeXMarkup([
        '--base-path', tmpDir,
        '--page-turn-optimized',
        '--piano',
        ...argsOnlyBasePath
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
      const tmpDir = tmpCopy('clean', 'one')
      const texFile = spawnGetTexFile([
        '--base-path', tmpDir,
        ...argsOnlyBasePath,
        '--piano'
      ])
      assertExists(tmpDir, 'a', 'Auf-der-Mauer', 'piano', 'piano.mscx')
      assertExists(texFile)
      assertNotExists(tmpDir, 'a', 'Auf-der-Mauer', 'slides', '01.svg')
      assertNotExists(tmpDir, 'a', 'Auf-der-Mauer', 'projector.pdf')
    })

    it('--projector-path', function () {
      const basePath = tmpCopy('clean', 'one')
      const projectorPath = mkTmpDir()
      spawn(script, [
        '--base-path', basePath,
        '--projector-path', projectorPath,
        '--slides'
      ])
      assertExists(projectorPath, 'a', 'Auf-der-Mauer', '01.svg')
      assertExists(projectorPath, 'a', 'Auf-der-Mauer', '02.svg')
      assertExists(projectorPath, 'songs.json')
      const songs = JSON.parse(
        fs.readFileSync(
          path.join(projectorPath, 'songs.json'), { encoding: 'utf-8' }
        )
      )
      assert.strictEqual(songs['Auf-der-Mauer'].songID, 'Auf-der-Mauer')
      assert.strictEqual(songs['Auf-der-Mauer'].slidesCount, 2)
    })

    it('--slides', function () {
      const tmpDir = tmpCopy('clean', 'one')
      const texFile = spawnGetTexFile([
        '--base-path', tmpDir,
        ...argsOnlyBasePath,
        '--slides'
      ])
      assertExists(tmpDir, 'a', 'Auf-der-Mauer', 'slides', '01.svg')
      assertNotExists(tmpDir, 'a', 'Auf-der-Mauer', 'slides', 'projector.pdf')
      assertNotExists(tmpDir, 'a', 'Auf-der-Mauer', 'piano', 'piano.mscx')
      assert.ok(!texFile)
    })

    it('--song-id', function () {
      const tmpDir = tmpCopy('clean', 'some')
      spawn(script, [
        '--base-path', tmpDir,
        ...argsOnlyBasePath,
        '--song-id', 'Auf-der-Mauer'
      ])
      assertExists(tmpDir, 'a', 'Auf-der-Mauer', 'slides', '01.svg')
    })

    it('--version', function () {
      const cli = spawn(script, ['--version'])
      const pckg = require(path.join(__dirname, '..', 'packages', 'cli', 'package.json'))
      assert.strictEqual(cli.stdout.toString(), pckg.version + '\n')
      assert.strictEqual(cli.status, 0)
    })
  })
})
