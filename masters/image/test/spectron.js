const {
  assert,
  path,
  Spectron
} = require('baldr-test');


let resolve = function(image) {
  return 'file://' + path.resolve('masters/image/images', image);
};

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

  it('Basic navigation', function () {
    return this.app.client
      .getAttribute('img', 'src')
      .then(src => {assert.equal(src, resolve('beethoven.jpg'));})

      .click('#nav-slide-next')
      .getAttribute('img', 'src')
      .then(src => {assert.equal(src, resolve('haydn.jpg'));})

      .click('#nav-slide-next')
      .getAttribute('img', 'src')
      .then(src => {assert.equal(src, resolve('mozart.jpg'));})

      .click('#nav-step-next')
      .getAttribute('img', 'src')
      .then(src => {assert.equal(src, resolve('beethoven.jpg'));})

      .click('#nav-step-next')
      .getAttribute('img', 'src')
      .then(src => {assert.equal(src, resolve('haydn.jpg'));})
      ;
  });

});
