const {
  assert,
  Spectron
} = require('baldr-test');

describe('Master slide “svg”: “example.baldr” #spectron', function () {
  this.timeout(10000);

  beforeEach(function () {
    this.spectron = new Spectron('masters/svg/example.baldr');
    this.app = this.spectron.getApp();
    return this.spectron.start();
  });

  afterEach(function () {
    return this.spectron.stop();
  });

  it('Text on the example slides', function () {
    return this.app.client
      .getText('#slide-content')
      .then(text => {assert.equal(text, 'svg');})

      ;
  });

});
