var assert = require('assert');
const fs = require('fs');
const path = require('path');
const rewire = require('rewire');

var Application = require('spectron').Application;
var pkg = require('../package.json');

let appPath;

if (process.platform === 'linux') {
 appPath = 'dist/linux-unpacked/baldr';
}
else if (process.platform === 'darwin') {
  appPath = 'dist/mac/baldr.app/Contents/MacOS/baldr';
}

describe('build', () => {

  it(`exists “${appPath}”`, () => {
    assert.ok(fs.existsSync(appPath));
  });

});

describe('Lauch without baldr file', function () {
  this.timeout(10000);

  beforeEach(function () {
    this.app = new Application({
      path: appPath
    });
    return this.app.start();
  });

  afterEach(function () {
    if (this.app && this.app.isRunning()) {
      return this.app.stop();
    }
  });

  it('Initial window', function () {
    return this.app.client
      .getWindowCount()
      .then(count => {
        assert.equal(count, 1);
      })
      .getTitle()
      .then(text => {
        assert.equal(text, 'baldr');
      })
      .getText('#slide').then(function (text) {
        assert.equal(text, 'Currently no slide is loaded!');
      });

  });

});


describe('Launch minimal.baldr', function () {
  this.timeout(10000);

  beforeEach(function () {
    this.app = new Application({
      path: appPath,
      args: [path.join('test', 'files', 'minimal.baldr')]
    });
    return this.app.start();
  });

  afterEach(function () {
    if (this.app && this.app.isRunning()) {
      return this.app.stop();
    }
  });

  it('Initial window', function () {
    return this.app.client
      .getText('.author').then(function (text) {
        assert.equal(text, 'Johann Wolfgang von Goethe');
      })
      .getCssProperty('.author', 'font-family').then(function (style) {
        assert.equal(style.value, 'alegreya sc');
      })
      .click('#button-right')
      .getText('li')
      .then(text => {
        assert.equal(text, 'Wann starb Ludwig van Beethoven?: 1827');
      })
      .click('#button-right')
      .getText('p')
      .then(text => {
        assert.equal(text, 'Ludwig van Beethoven');
      });
  });

});
