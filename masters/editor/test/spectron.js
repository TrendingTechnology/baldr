const {
  assert,
  path,
  Spectron
} = require('baldr-test');

describe('Master slide “editor”: Spectron tests on “example.baldr”', function () {
  this.timeout(10000);

  beforeEach(function () {
    this.spectron = new Spectron('masters/editor/example.baldr');
    this.app = this.spectron.getApp();
    return this.spectron.start();
  });

  afterEach(function () {
    return this.spectron.stop();
  });

  it('Basic navigation', function () {
    return this.app.client
      .pause(5000)
      .getHTML('.ct-app')
      .then(text => {assert.equal(text, 'Video source:');})

      ;
  });

});
