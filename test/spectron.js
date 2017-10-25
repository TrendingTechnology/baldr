var assert = require('assert');
const fs = require('fs');
const path = require('path');
var Application = require('spectron').Application;

var pkg = require('../package.json');

var appPath = path.join(
  'dist',
  `${process.platform}-unpacked`,
  pkg.name
);

describe('build', () => {

  it(`exists “${appPath}”`, () => {
    assert.ok(fs.existsSync(appPath));
  });

});

describe('application launch', function () {
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
      });
  });


});
