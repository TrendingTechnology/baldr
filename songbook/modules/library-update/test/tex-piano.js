/* jshint esversion: 6 */

const {assert} = require('./lib/helper.js');
const path = require('path');
const fs = require('fs');
const texPiano = require('../tex-piano.js');
const rewire = require('rewire')('../tex-piano.js');

describe('TeX', () => {

  it('"texCmd()"', () => {
    var texCmd = rewire.__get__('texCmd');
    assert.equal(texCmd('lorem', 'ipsum'), '\\tmplorem{ipsum}\n')
  });

  it('"texABC()"', () => {
    var texAlpha = rewire.__get__('texABC');
    assert.equal(texAlpha('a'), '\n\n\\tmpchapter{A}\n')
  });

  it('"texSong()"', () => {
    var texSong = rewire.__get__('texSong');
    var folder = path.join(path.resolve('songs_processed'), 's', 'Swing-low');
    assert.equal(
      texSong(folder),
      '\n' +
      '\\tmpheading{Swing low}\n' +
      '\\tmpimage{Swing-low/piano/piano_1.eps}\n' +
      '\\tmpimage{Swing-low/piano/piano_2.eps}\n' +
      '\\tmpimage{Swing-low/piano/piano_3.eps}\n'
    );
  });

  it('"generateTeX()"', () => {
    texFile = path.join('songs_processed', 'songs.tex');
    texPiano.generateTeX(path.resolve('songs_processed'));
    assert.exists(texFile);

    var tex = fs.readFileSync(texFile, 'utf8');
    var compare = fs.readFileSync(path.join('test', 'songs.tex'), 'utf8');

    assert.equal(tex, compare);

    assert.ok(tex.indexOf('\\tmpimage') > -1);
    assert.ok(tex.indexOf('\\tmpheading') > -1);
  });

});
