/* jshint esversion: 6 */

const {assert} = require('./lib/helper.js');
const path = require('path');
var folderTree = require('../tex-piano.js');
var rewire = require('rewire')('../tex-piano.js');

describe('TeX', function() {

  it('"texCmd()"', function() {
    var texCmd = rewire.__get__('texCmd');
    assert.equal(texCmd('lorem', 'ipsum'), '\\tmplorem{ipsum}\n')
  });

  it('"texABC()"', function() {
    var texAlpha = rewire.__get__('texABC');
    assert.equal(texAlpha('a'), '\n\n\\tmpchapter{A}\n')
  });

  it('"texSong()"', function() {
    var texSong = rewire.__get__('texSong');
    var folder = path.join(path.resolve('songs_processed'), 's', 'Swing-low');
    assert.equal(
      texSong(folder),
      '\\tmpheading{Swing low}\n' +
      '\\tmpimage{Swing-low/piano/piano_1.eps}\n' +
      '\\tmpimage{Swing-low/piano/piano_2.eps}\n' +
      '\\tmpimage{Swing-low/piano/piano_3.eps}\n'
    );
  });
});
