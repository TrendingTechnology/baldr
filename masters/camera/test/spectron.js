const {
  assert,
  path,
  Spectron
} = require('baldr-test');

describe('Master slide “camera”: Spectron tests on “example.baldr”', function () {
  this.timeout(10000);

  beforeEach(function () {
    this.spectron = new Spectron('masters/camera/example.baldr');
    this.app = this.spectron.getApp();
    return this.spectron.start();
  });

  afterEach(function () {
    return this.spectron.stop();
  });

  it('Basic navigation', function () {
    return this.app.client
      .click('#modal-open')
      .getText('#modal-content label')
      .then(text => {assert.equal(text, 'Video source:');})
      ;
  });

});
