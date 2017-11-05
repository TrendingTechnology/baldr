const {
  assert,
  fs,
  path,
  Spectron
} = require('baldr-test');

describe('question example.baldr', function () {
  this.timeout(10000);

  beforeEach(function () {
    this.spectron = new Spectron('masters/question/example.baldr');
    this.app = this.spectron.getApp();
    return this.spectron.start();
  });

  afterEach(function () {
    return this.spectron.stop();
  });

  it('Initial window', function () {
    return this.app.client
      .getText('li:nth-child(1) .question')
      .then(text => {assert.equal(text, 'Question one?');});
  });

});
