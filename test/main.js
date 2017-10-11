var assert = require('assert');
const fs = require('fs');
var Application = require('spectron').Application

describe('build', () => {

  it('exists “dist/baldr-sbook-linux-x64/resources/app.asar”', () => {
    assert.ok(fs.existsSync('dist/baldr-sbook-linux-x64/resources/app.asar'));
  });

});

describe('application launch', function () {
  this.timeout(10000)

  beforeEach(function () {
    this.app = new Application({
      path: 'dist/baldr-sbook-linux-x64/baldr-sbook'
    })
    return this.app.start()
  })

  afterEach(function () {
    if (this.app && this.app.isRunning()) {
      return this.app.stop()
    }
  })

  it('shows an initial window', function () {
    return this.app.client.getWindowCount().then(function (count) {
      assert.equal(count, 1)
    })
  })
})
