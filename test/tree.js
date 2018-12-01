const assert = require('assert')
const path = require('path')
let tree = require('../tree.js')
let rewire = require('rewire')('../tree.js')

describe('file “tree.js”', () => {
  it('function “getSongInfo()”', () => {
    let info = tree.getSongInfo(
      path.join('test', 'songs', 'clean', 'some', 's', 'Swing-low')
    )
    assert.strictEqual(info.title, 'Swing low')
  })

  it('function “getSongFolders()”', () => {
    let getSongFolders = rewire.__get__('getSongFolders')
    let folders = getSongFolders(path.resolve('test', 'songs', 'clean', 'some'), 's')
    assert.strictEqual(folders.length, 2)
    assert.deepStrictEqual(folders, ['Stille-Nacht', 'Swing-low'])
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
