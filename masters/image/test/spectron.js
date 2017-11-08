const {
  assert,
  path,
  Spectron
} = require('baldr-test');

describe('Master slide “image”: Spectron tests on “example.baldr”', function () {
  this.timeout(10000);

  beforeEach(function () {
    this.spectron = new Spectron('masters/image/example.baldr');
    this.app = this.spectron.getApp();
    return this.spectron.start();
  });

  afterEach(function () {
    return this.spectron.stop();
  });

  it('', function () {
    return this.app.client
      .getAttribute('img', 'src')
      .then(src => {
        assert.equal(
          src,
          'file://' + path.resolve('masters/image/images/beethoven.jpg'));
      })

      ;
  });

});
