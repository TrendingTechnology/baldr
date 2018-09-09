var assert = require('assert');
const fs = require('fs');
var Application = require('spectron').Application;

describe('build', () => {

  it('exists “dist/baldr-document-camera-linux-x64/resources/app.asar”', () => {
    assert.ok(fs.existsSync('dist/baldr-document-camera-linux-x64/resources/app.asar'));
  });

});

describe('application launch', function () {
  this.timeout(10000);

  before(function () {
    this.app = new Application({
      path: 'dist/baldr-document-camera-linux-x64/baldr-document-camera'
    });
    return this.app.start();
  });

  after(function () {
    if (this.app && this.app.isRunning()) {
      return this.app.stop();
    }
  });

  it('shows an initial window', function () {
    return this.app.client.getWindowCount().then(function (count) {
      assert.equal(count, 1);
    });
  });

  it('CSS property: background-color', function () {
    return this.app.client.$('body').getCssProperty('background-color').then(function (color) {
      assert.equal(color.value, 'rgba(0,0,0,1)');
    });
  });

});
