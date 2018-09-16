var rewire = require('rewire');
var index = rewire("../lib/song-ng.js");
let Song = index.__get__('Song');

const assert = require("assert");

describe('Class Song', () => {

  describe('get title', () => {
    it('title only', () => {
      song = new Song({'title': 'lol'});
      assert.equal(song.title, 'lol');
    });
    it('title and year', () => {
      song = new Song({'title': 'lol', 'year': 1984});
      assert.equal(song.title, 'lol (1984)');
    });
  });

  describe('get subtitle', () => {
    it('all properties', () => {
      song = new Song({'subtitle': 's', 'alias': 'a', 'country': 'c'});
      assert.equal(song.subtitle, 's - a - c');
    });
    it('no properties', () => {
      song = new Song({});
      assert.equal(song.subtitle, '');
    });
  });

  describe('get composer', () => {
    it('all properties', () => {
      song = new Song({'composer': 'c', 'artist': 'a', 'genre': 'g'});
      assert.equal(song.composer, 'c, a, g');
    });
    it('no properties', () => {
      song = new Song({});
      assert.equal(song.composer, '');
    });
  });

  describe('get lyricist', () => {
    it('all properties', () => {
      song = new Song({'lyricist': 'l'});
      assert.equal(song.lyricist, 'l');
    });
    it('no properties', () => {
      song = new Song({});
      assert.equal(song.lyricist, '');
    });
  });

});
