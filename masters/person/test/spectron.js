const {
  assert,
  Spectron
} = require('baldr-test');

describe('Master slide “person”: Spectron tests on “example.baldr”', function () {
  this.timeout(10000);

  beforeEach(function () {
    this.spectron = new Spectron('masters/person/example.baldr');
    this.app = this.spectron.getApp();
    return this.spectron.start();
  });

  afterEach(function () {
    return this.spectron.stop();
  });

  it('Text on the example slides', function () {
    return this.app.client
      .getText('#info-box p')
      .then(text => {assert.equal(text, 'Ludwig van Beethoven');})

      ;
  });

});
