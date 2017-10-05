const {assert} = require('./lib/helper.js');
const path = require('path');
const fs = require('fs-extra');
const jsonSlides = require('../json-slides.js');
const rewire = require('rewire')('../json-slides.js');

describe('file “json-slides.js”', () => {

  it('function “generateSongJSON()”', () => {
    var info = rewire.__get__('generateSongJSON')(path.join(
      path.resolve('songs_processed'),
      'a',
      'Auf-der-Mauer_auf-der-Lauer'
    ));
    assert.equal(
      info.title,
      'Auf der Mauer, auf der Lauer'
    );
  });

  it('function “generateJSON()”', () => {
    var json = path.join('songs_processed', 'songs.json');
    jsonSlides.generateJSON('songs_processed');
    assert.exists(json);
    var tree = JSON.parse(fs.readFileSync(json, 'utf8'));
    assert.equal(
      tree.a['Auf-der-Mauer_auf-der-Lauer'].title,
      'Auf der Mauer, auf der Lauer'
    );
    fs.removeSync(json);
  });

  it('function “readJSON()”', () => {
    jsonSlides.generateJSON('songs_processed');
    var json = jsonSlides.readJSON('songs_processed');
    assert.equal(
      json.a['Auf-der-Mauer_auf-der-Lauer'].title,
      'Auf der Mauer, auf der Lauer'
    );
  });

});
