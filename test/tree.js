const { assert } = require('./lib/helper.js')
const path = require('path')
const fs = require('fs')
let tree = require('../tree.js')
let rewire = require('rewire')('../tree.js')

describe('file “tree.js”', () => {
  it('function “getSongInfo()”', () => {
    let info = tree.getSongInfo(
      path.join('test', 'songs', 'clean', 'some', 's', 'Swing-low')
    )
    assert.strictEqual(info.title, 'Swing low')
  })

  describe('function “getFolderFiles()”', () => {
    it('function “getFolderFiles()”: eps', () => {
      const files = tree.getFolderFiles(
        path.join('test', 'files', 'piano'), '.eps'
      )
      assert.deepStrictEqual(files, ['01.eps', '02.eps', '03.eps'])
    })

    it('function “getFolderFiles()”: svg', () => {
      const files = tree.getFolderFiles(
        path.join('test', 'files', 'slides'), '.svg'
      )
      assert.deepStrictEqual(files, ['01.svg', '02.svg', '03.svg'])
    })

    it('function “getFolderFiles()”: non existent folder', () => {
      const files = tree.getFolderFiles(
        path.join('test', 'files', 'lol'), '.svg'
      )
      assert.deepStrictEqual(files, [])
    })

    it('function “getFolderFiles()”: empty folder', () => {
      const empty = path.join('test', 'files', 'empty')
      fs.mkdirSync(empty)
      const files = tree.getFolderFiles(
        empty, '.svg'
      )
      assert.deepStrictEqual(files, [])
      fs.rmdirSync(empty)
    })
  })

  it('function “getSongFolders()”', () => {
    let getSongFolders = rewire.__get__('getSongFolders')
    let folders = getSongFolders(path.resolve('test', 'songs', 'clean', 'some'), 's')
    assert.strictEqual(folders.length, 2)
    assert.deepStrictEqual(folders, ['Stille-Nacht', 'Swing-low'])
  })

  it('function “getABCFolders()”', () => {
    let getABCFolders = rewire.__get__('getABCFolders')
    let folders = getABCFolders(path.resolve('test', 'songs', 'clean', 'some'))
    assert.strictEqual(folders.length, 3)
    assert.deepStrictEqual(folders, ['a', 's', 'z'])
  })

  it('function “getTree()”', () => {
    let folderTree = tree.getTree(path.resolve('test', 'songs', 'clean', 'some'))
    assert.deepStrictEqual(folderTree.a, { 'Auf-der-Mauer_auf-der-Lauer': {} })
    assert.deepStrictEqual(folderTree.s, { 'Stille-Nacht': {}, 'Swing-low': {} })
  })

  it('function “flattenTree()”', () => {
    let folderTree = {
      'a': {
        'Auf-der-Mauer_auf-der-Lauer': {}
      },
      's': {
        'Stille-Nacht': {},
        'Swing-low': {}
      },
      'z': {
        'Zum-Tanze-da-geht-ein-Maedel': {}
      }
    }

    assert.deepStrictEqual(tree.flattenTree(folderTree), [
      'a/Auf-der-Mauer_auf-der-Lauer',
      's/Stille-Nacht',
      's/Swing-low',
      'z/Zum-Tanze-da-geht-ein-Maedel'
    ])
  })

  it('function “flat()”', () => {
    let flat = tree.flat(path.resolve('test', 'songs', 'clean', 'some'))
    assert.strictEqual(flat.length, 4)
  })
})
