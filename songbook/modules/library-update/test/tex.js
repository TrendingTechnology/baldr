/* jshint esversion: 6 */

const {assert} = require('./lib/helper.js');
const rewire = require('rewire');
const path = require('path');

var slu = rewire('../index.js');
slu.bootstrapConfig({
  test: true,
  path: path.resolve('songs'),
  force: true,
});

before(function() {
  process.env.PATH = __dirname + '/bin:' + process.env.PATH;
});

describe('TeX', function() {
  it('"texCmd()"', function() {
    var texCmd = slu.__get__('texCmd');
    assert.equal(texCmd('lorem', 'ipsum'), '\\tmplorem{ipsum}\n')
  });

  it('"texAlpha()"', function() {
    var texAlpha = slu.__get__('texAlpha');
    assert.equal(texAlpha('a'), '\n\n\\tmpchapter{A}\n')
  });

  it('"texSong()"', function() {
    var texSong = slu.__get__('texSong');
    var generatePianoEPS = slu.__get__('generatePianoEPS');
    var cleanFolder = slu.__get__('cleanFolder');

    var folder = path.join(path.resolve('songs'), 's', 'Swing-low');
    generatePianoEPS(folder);
    assert.equal(
      texSong(folder),
      '\\tmpheading{Swing low}\n' +
      '\\tmpimage{Swing-low/piano/piano_1.eps}\n' +
      '\\tmpimage{Swing-low/piano/piano_2.eps}\n'
    );
    cleanFolder(folder);
  });
});
