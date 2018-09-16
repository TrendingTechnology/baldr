var rewire = require('rewire');
var index = rewire("../lib/song-ng.js");
let Song = index.__get__('Song');

const assert = require("assert");

describe('Class Song', () => {

  it('getter title', () => {
    song = new Song({'title': 'lol'});
    assert.equal(song.title, 'lol');

    song = new Song({'title': 'lol', 'year': 1984});
    assert.equal(song.title, 'lol (1984)');
  });


});
