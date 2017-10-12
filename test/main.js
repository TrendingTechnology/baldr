var assert = require('assert');
const fs = require('fs');
var Application = require('spectron').Application;

describe('build', () => {

  it('exists “dist/baldr-dcamr-linux-x64/resources/app.asar”', () => {
    assert.ok(fs.existsSync('dist/baldr-dcamr-linux-x64/resources/app.asar'));
  });

});

describe('application launch', function () {
  this.timeout(10000);

  before(function () {
    this.app = new Application({
      path: 'dist/baldr-dcamr-linux-x64/baldr-dcamr'
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

});
