/* jshint esversion: 6 */

const {assert} = require('./lib/helper.js');
const path = require('path');
const fs = require('fs');
var folderTree = require('../folder-tree.js');
var rewire = require('rewire')('../folder-tree.js');

describe('folder-tree', () => {

  it('"getSongInfo()"', () => {
    var info = folderTree.getSongInfo(
      path.join('songs', 's', 'Swing-low')
    );
    assert.equal(info.title, 'Swing low');
  });

  describe('"getFolderFiles()"', () => {

    it('"getFolderFiles()": eps', () => {
      const files = folderTree.getFolderFiles(
        path.join('test', 'piano-files'), '.eps'
      );
      assert.deepEqual(files, ['01.eps', '02.eps', '03.eps']);
    });

    it('"getFolderFiles()": svg', () => {
      const files = folderTree.getFolderFiles(
        path.join('test', 'slides-files'), '.svg'
      );
      assert.deepEqual(files, ['01.svg', '02.svg', '03.svg']);
    });

    it('"getFolderFiles()": non existent folder', () => {
      const files = folderTree.getFolderFiles(
        path.join('test', 'lol'), '.svg'
      );
      assert.deepEqual(files, []);
    });

    it('"getFolderFiles()": empty folder', () => {
      const empty = path.join('test', 'empty');
      fs.mkdirSync(empty);
      const files = folderTree.getFolderFiles(
        empty, '.svg'
      );
      assert.deepEqual(files, []);
      fs.rmdirSync(empty);
    });
  });

  it('"getSongFolders()"', () => {
    var getSongFolders = rewire.__get__('getSongFolders');
    var folders = getSongFolders(path.resolve('songs'), 's');
    assert.equal(folders.length, 2);
    assert.deepEqual(folders, ['Stille-Nacht', 'Swing-low']);
  });

  it('"getABCFolders()"', () => {
    var getABCFolders = rewire.__get__('getABCFolders');
    var folders = getABCFolders(path.resolve('songs'));
    assert.equal(folders.length, 3);
    assert.deepEqual(folders, ['a', 's', 'z']);
  });

  it('"getTree()"', () => {
    var tree = folderTree.getTree(path.resolve('songs'));
    assert.deepEqual(tree.a, { 'Auf-der-Mauer_auf-der-Lauer': {} });
    assert.deepEqual(tree.s, { 'Stille-Nacht': {}, 'Swing-low': {} });
  });

  it('"flattenTree()"', () => {
    var flattenTree = rewire.__get__('flattenTree');

    var tree = {
      "a": {
        "Auf-der-Mauer_auf-der-Lauer": {}
      },
      "s": {
        "Stille-Nacht": {},
        "Swing-low": {}
      },
      "z": {
        "Zum-Tanze-da-geht-ein-Maedel": {}
      }
    };

    assert.deepEqual(flattenTree(tree), [
      'a/Auf-der-Mauer_auf-der-Lauer',
      's/Stille-Nacht',
      's/Swing-low',
      'z/Zum-Tanze-da-geht-ein-Maedel'
    ]);
  });
});
