var assert = require('assert');
const fs = require('fs');
const path = require('path');
var Application = require('spectron').Application;

process.env.BALDR_SBOOK_PATH = path.resolve('test', 'songs');

describe('build', () => {

  it('exists “dist/baldr-sbook-linux-x64/baldr-sbook”', () => {
    assert.ok(fs.existsSync('dist/baldr-sbook-linux-x64/baldr-sbook'));
  });

});

describe('application launch', function () {
  this.timeout(10000);

  beforeEach(function () {
    this.app = new Application({
      path: 'dist/baldr-sbook-linux-x64/baldr-sbook'
    });
    return this.app.start();
  });

  afterEach(function () {
    if (this.app && this.app.isRunning()) {
      return this.app.stop();
    }
  });

  it('Initial window', function () {
    return this.app.client
      .getWindowCount()
      .then(count => {
        assert.equal(count, 1);
      })
      .getTitle()
      .then(text => {
        assert.equal(text, 'Liederbuch „Die besten Lieder“');
      });
  });

  it('tableofcontent', function () {
    return this.app.client
      .click('#search .close')
      .keys('Alt')
      .getText('#tableofcontents h2').then(function (text) {
        assert.equal(text, 'Inhaltsverzeichnis');
      })
      .getText('#song_Swing-low').then(function (text) {
        assert.equal(text, 'Swing low');
      })
      .getText('#toc-field ul li ul li').then(function (text) {
        assert.deepEqual(
          text,
          [
            'Auf der Mauer, auf der Lauer',
            'Stille Nacht',
            'Swing low',
            'Zum Tanze, da geht ein Mädel'
          ]
        );
      });
  });

  it('selectize', function () {
    return this.app.client.element('.selectize-control')
    .then(field => {
      assert.ok(field.value.ELEMENT);
    })
    .$$('.selectize-dropdown-content .option')
    .then(options => {
      assert.equal(options.length, 4);
    });
  });

});
