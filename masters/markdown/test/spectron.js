const {
  assert,
  Spectron
} = require('baldr-test');

describe('Master slide “markdown”: “example.baldr” #spectron', function () {
  this.timeout(10000);

  beforeEach(function () {
    this.spectron = new Spectron('masters/markdown/example.baldr');
    this.app = this.spectron.getApp();
    return this.spectron.start();
  });

  afterEach(function () {
    return this.spectron.stop();
  });

  it('Text on the example slides', function () {
    return this.app.client
      .getText('h1')
      .then(text => {assert.equal(text, 'heading 1');})
      .getText('h2')
      .then(text => {assert.equal(text, 'heading 2');})

      .click('#nav-slide-next')
      .getText('p')
      .then(text => {assert.equal(text[0], 'Lorem ipsum dolor sit amet ...');})

      .click('#nav-slide-next')
      .getText('ol li')
      .then(text => {assert.equal(text[0], 'one');})

      .click('#nav-slide-next')
      .getText('ul li')
      .then(text => {assert.equal(text[0], 'one');})

      ;
  });

});
