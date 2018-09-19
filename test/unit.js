const {Library, SongMetaData} = require('../lib/without-dom.js');
const assert = require('assert');
const path = require('path');

describe('Class “Library”', () => {

  before(() => {
    this.library = new Library(path.join(__dirname, 'songs', 'songs.json'));
  });

  describe('properties', () => {
    it('tree', () => {
      assert.ok(this.library.tree);
      assert.equal(
        this.library.tree.a['Auf-der-Mauer_auf-der-Lauer'].title,
        'Auf der Mauer, auf der Lauer'
      );
    });
    it('list', () => {
      assert.ok(this.library.list);
      assert.equal(
        this.library.list['Auf-der-Mauer_auf-der-Lauer'].title,
        'Auf der Mauer, auf der Lauer'
      );
    });
  });

  describe('methods', () => {
    it('flattenTree_', () => {
      let list = Library.flattenTree_(this.library.tree);
    });
  });

});

describe('Class “SongMetaData”', () => {

  describe('get title', () => {
    it('title only', () => {
      song = new SongMetaData({'title': 'lol'});
      assert.equal(song.title, 'lol');
    });
    it('title and year', () => {
      song = new SongMetaData({'title': 'lol', 'year': 1984});
      assert.equal(song.title, 'lol (1984)');
    });
  });

  describe('get subtitle', () => {
    it('all properties', () => {
      song = new SongMetaData({'subtitle': 's', 'alias': 'a', 'country': 'c'});
      assert.equal(song.subtitle, 's - a - c');
    });
    it('no properties', () => {
      song = new SongMetaData({});
      assert.equal(song.subtitle, '');
    });
  });

  describe('get composer', () => {
    it('all properties', () => {
      song = new SongMetaData({'composer': 'c', 'artist': 'a', 'genre': 'g'});
      assert.equal(song.composer, 'c, a, g');
    });
    it('no properties', () => {
      song = new SongMetaData({});
      assert.equal(song.composer, '');
    });
  });

  describe('get lyricist', () => {
    it('all properties', () => {
      song = new SongMetaData({'lyricist': 'l'});
      assert.equal(song.lyricist, 'l');
    });
    it('no properties', () => {
      song = new SongMetaData({});
      assert.equal(song.lyricist, '');
    });
  });

});
