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
      .getText('#slide').then(text => {
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
      .getText('.author').then(text => {
        assert.equal(text, 'Johann Wolfgang von Goethe');
      })
      .getCssProperty('.author', 'font-family').then(style => {
        assert.equal(style.value, 'alegreya sc');
      })
      .getCssProperty('button', 'color').then(style => {
        assert.equal(style[0].parsed.hex, '#0000ff');
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

  it('Shortcuts', function () {
    return this.app.client

      .keys('ArrowRight')
      .getText('li')
      .then(text => {
        assert.equal(text, 'Wann starb Ludwig van Beethoven?: 1827');
      })

      .keys('ArrowRight')
      .getText('p')
      .then(text => {
        assert.equal(text, 'Ludwig van Beethoven');
      });
  });

  it('Modal window', function () {
    return this.app.client

      .click('#modal-open button')
      .getCssProperty('#modal', 'display').then(style => {
        assert.equal(style.value, 'block');
      })

      .click('#modal-open button')
      .getCssProperty('#modal', 'display').then(style => {
        assert.equal(style.value, 'none');
      })

      .click('#modal-open button')
      .getCssProperty('#modal', 'display').then(style => {
        assert.equal(style.value, 'block');
      })

      .click('#modal-close')
      .getCssProperty('#modal', 'display').then(style => {
        assert.equal(style.value, 'none');
      })

      .keys('Escape')
      .getCssProperty('#modal', 'display').then(style => {
        assert.equal(style.value, 'block');
      })

      .keys('Escape')
      .getCssProperty('#modal', 'display').then(style => {
        assert.equal(style.value, 'none');
      })

      ;
  });

});
