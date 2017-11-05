const {
  assert,
  fs,
  path,
  Spectron
} = require('../../../test/lib/helper.js');

describe('question example.baldr', function () {
  this.timeout(10000);

  beforeEach(function () {
    this.app = new Spectron('masters/question/example.baldr').get();
    return this.app.start();
  });

  afterEach(function () {
    return this.app.stop();
  });

  it('Initial window', function () {
    return this.app.client
      .getText('li:nth-child(1) .question')
      .then(text => {assert.equal(text, 'Question one?');});
  });

});
