var rewire = require('rewire');
var index = rewire("../lib/song-ng.js");
let SongMetaData = index.__get__('SongMetaData');

const assert = require("assert");

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
