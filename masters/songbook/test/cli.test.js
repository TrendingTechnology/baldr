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
    it('--base-path', function () {
      let tmpDir = tmpCopy('clean', 'one')
      let process = spawn('./packages/cli/index.js', ['--base-path', tmpDir])
      assert.strictEqual(process.status, 0)

      let stdout = process.stdout.toString()
      assert.ok(stdout.includes(removeANSI(util.format('The base path of the song collection is located at:'))))
      // assert.ok(stdout.includes(removeANSI(util.format('The base path of the song collection is located at:\n    %s\n', tmpDir))))
      assert.ok(stdout.includes(removeANSI(util.format('Found %s songs.', 1))))

      assertExists(tmpDir, 'a', 'Auf-der-Mauer', 'piano', 'piano.mscx')
      assertExists(tmpDir, 'songs.tex')
      assertExists(tmpDir, 'a', 'Auf-der-Mauer', 'slides', '01.svg')
      assertExists(tmpDir, 'a', 'Auf-der-Mauer', 'projector.pdf')
    })

    it('--clean', function () {
      let tmpDir = tmpCopy('processed', 'one')
      spawn('./packages/cli/index.js', ['--base-path', tmpDir, '--clean'])
      assertNotExists(tmpDir, 's', 'Swing-low', 'piano', 'piano.mscx')
    })

    it('--help', function () {
      const cli = spawn('./packages/cli/index.js', ['--help'])
      let out = cli.stdout.toString()
      assert.ok(out.indexOf('Usage') > -1)
      assert.ok(out.indexOf('--help') > -1)
      assert.ok(out.indexOf('--version') > -1)
      assert.strictEqual(cli.status, 0)
    })

    it('--folder', function () {
      let tmpDir = tmpCopy('clean', 'some')
      spawn('./packages/cli/index.js', ['--base-path', tmpDir, '--folder', path.join(tmpDir, 'a', 'Auf-der-Mauer')])
      assertExists(tmpDir, 'a', 'Auf-der-Mauer', 'slides', '01.svg')
    })

    it('--force', function () {
      let tmpDir = tmpCopy('clean', 'one')
      let notForced = spawn('./packages/cli/index.js', ['--base-path', tmpDir])
      assert.ok(!notForced.stdout.toString().includes('(forced)'))
      let forced = spawn('./packages/cli/index.js', ['--base-path', tmpDir, '--force'])
      assert.ok(forced.stdout.toString().includes('(forced)'))
    })

    it('--group-alphabetically', function () {
      let tmpDir = tmpCopy('clean', 'some')
      spawn('./packages/cli/index.js', ['--base-path', tmpDir, '--group-alphabetically', '--piano'])
      let texMarkup = read(path.join(tmpDir, 'songs.tex'))
      assert.strictEqual(texMarkup, `

\\tmpchapter{A}

\\tmpheading{Auf der Mauer, auf der Lauer}
\\tmpimage{a/Auf-der-Mauer/piano/piano_1.eps}
\\tmpimage{a/Auf-der-Mauer/piano/piano_2.eps}


\\tmpchapter{S}

\\tmpheading{Stille Nacht}
\\tmpimage{s/Stille-Nacht/piano/piano_1.eps}
\\tmpimage{s/Stille-Nacht/piano/piano_2.eps}

\\tmpheading{Swing low}
\\tmpimage{s/Swing-low/piano/piano_1.eps}
\\tmpimage{s/Swing-low/piano/piano_2.eps}


\\tmpchapter{Z}

\\tmpheading{Zum Tanze, da geht ein Mädel}
\\tmpimage{z/Zum-Tanze-da-geht-ein-Maedel/piano/piano_1.eps}
\\tmpimage{z/Zum-Tanze-da-geht-ein-Maedel/piano/piano_2.eps}
`)
    })

    it('--list', function () {
      let tmpDir = tmpCopy('clean', 'some')
      let process = spawn('./packages/cli/index.js', ['--base-path', tmpDir, '--list', path.join('test', 'files', 'song-id-list.txt')])
      let stdout = process.stdout.toString()
      assert.ok(stdout.includes('Auf-der-Mauer'))
      assert.ok(stdout.includes('Swing-low'))
      assert.ok(!stdout.includes('Stille-Nacht'))
    })

    it('--page-turn-optimized --group-alphabetically', function () {
      let tmpDir = tmpCopy('clean', 'some')
      spawn('./packages/cli/index.js', ['--base-path', tmpDir, '--page-turn-optimized', '--group-alphabetically', '--piano'])
      let texMarkup = read(path.join(tmpDir, 'songs.tex'))
      assert.strictEqual(texMarkup, `

\\tmpchapter{A}

\\tmpheading{Auf der Mauer, auf der Lauer}
\\tmpimage{a/Auf-der-Mauer/piano/piano_1.eps}
\\tmpimage{a/Auf-der-Mauer/piano/piano_2.eps}


\\tmpchapter{S}

\\tmpheading{Stille Nacht}
\\tmpimage{s/Stille-Nacht/piano/piano_1.eps}
\\tmpimage{s/Stille-Nacht/piano/piano_2.eps}

\\tmpheading{Swing low}
\\tmpimage{s/Swing-low/piano/piano_1.eps}
\\tmpimage{s/Swing-low/piano/piano_2.eps}
\\tmpplaceholder
\\tmpplaceholder


\\tmpchapter{Z}

\\tmpheading{Zum Tanze, da geht ein Mädel}
\\tmpimage{z/Zum-Tanze-da-geht-ein-Maedel/piano/piano_1.eps}
\\tmpimage{z/Zum-Tanze-da-geht-ein-Maedel/piano/piano_2.eps}
`)
    })

    it('--page-turn-optimized --group-alphabetically --list', function () {
      let tmpDir = tmpCopy('clean', 'some')
      spawn('./packages/cli/index.js', ['--base-path', tmpDir, '--page-turn-optimized', '--group-alphabetically', '--list', path.join('test', 'files', 'song-id-list.txt'), '--piano'])
      let texMarkup = read(path.join(tmpDir, 'songs.tex'))
      assert.strictEqual(texMarkup, `

\\tmpchapter{A}

\\tmpheading{Auf der Mauer, auf der Lauer}
\\tmpimage{a/Auf-der-Mauer/piano/piano_1.eps}
\\tmpimage{a/Auf-der-Mauer/piano/piano_2.eps}


\\tmpchapter{S}

\\tmpheading{Swing low}
\\tmpimage{s/Swing-low/piano/piano_1.eps}
\\tmpimage{s/Swing-low/piano/piano_2.eps}
`)
    })

    it('--page-turn-optimized', function () {
      let tmpDir = tmpCopy('clean', 'some')
      spawn('./packages/cli/index.js', ['--base-path', tmpDir, '--page-turn-optimized', '--piano'])
      let texMarkup = read(path.join(tmpDir, 'songs.tex'))
      assert.strictEqual(texMarkup, `
\\tmpheading{Auf der Mauer, auf der Lauer}
\\tmpimage{a/Auf-der-Mauer/piano/piano_1.eps}
\\tmpimage{a/Auf-der-Mauer/piano/piano_2.eps}

\\tmpheading{Stille Nacht}
\\tmpimage{s/Stille-Nacht/piano/piano_1.eps}
\\tmpimage{s/Stille-Nacht/piano/piano_2.eps}

\\tmpheading{Swing low}
\\tmpimage{s/Swing-low/piano/piano_1.eps}
\\tmpimage{s/Swing-low/piano/piano_2.eps}

\\tmpheading{Zum Tanze, da geht ein Mädel}
\\tmpimage{z/Zum-Tanze-da-geht-ein-Maedel/piano/piano_1.eps}
\\tmpimage{z/Zum-Tanze-da-geht-ein-Maedel/piano/piano_2.eps}
\\tmpplaceholder
\\tmpplaceholder
`)
    })

    it('--piano', function () {
      let tmpDir = tmpCopy('clean', 'one')
      spawn('./packages/cli/index.js', ['--base-path', tmpDir, '--piano'])
      assertExists(tmpDir, 'a', 'Auf-der-Mauer', 'piano', 'piano.mscx')
      assertExists(tmpDir, 'songs.tex')
      assertNotExists(tmpDir, 'a', 'Auf-der-Mauer', 'slides', '01.svg')
      assertNotExists(tmpDir, 'a', 'Auf-der-Mauer', 'projector.pdf')
    })

    it('--slides', function () {
      let tmpDir = tmpCopy('clean', 'one')
      spawn('./packages/cli/index.js', ['--base-path', tmpDir, '--slides'])
      assertExists(tmpDir, 'a', 'Auf-der-Mauer', 'slides', '01.svg')
      assertExists(tmpDir, 'a', 'Auf-der-Mauer', 'projector.pdf')
      assertNotExists(tmpDir, 'a', 'Auf-der-Mauer', 'piano', 'piano.mscx')
      assertNotExists(tmpDir, 'songs.tex')
    })

    it('--song-id', function () {
      let tmpDir = tmpCopy('clean', 'some')
      spawn('./packages/cli/index.js', ['--base-path', tmpDir, '--song-id', 'Auf-der-Mauer'])
      assertExists(tmpDir, 'a', 'Auf-der-Mauer', 'slides', '01.svg')
    })

    it('--version', function () {
      const cli = spawn('./packages/cli/index.js', ['--version'])
      let pckg = require(path.join(__dirname, '..', 'packages', 'cli', 'package.json'))
      assert.strictEqual(cli.stdout.toString(), pckg.version + '\n')
      assert.strictEqual(cli.status, 0)
    })
  })
})
