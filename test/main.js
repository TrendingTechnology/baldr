var assert = require('assert');
const fs = require('fs');
const path = require('path');
var Application = require('spectron').Application;

process.env.BALDR_SBOOK_PATH = path.resolve('test', 'songs');

describe('build', () => {

  it('exists “dist/baldr-sbook-linux-x64/resources/app.asar”', () => {
    assert.ok(fs.existsSync('dist/baldr-sbook-linux-x64/resources/app.asar'));
  });

});

describe('application launch', function () {
  this.timeout(10000);

  before(function () {
    this.app = new Application({
      path: 'dist/baldr-sbook-linux-x64/baldr-sbook'
    });
    return this.app.start();
  });

  after(function () {
    if (this.app && this.app.isRunning()) {
      return this.app.stop();
    }
  });

  it('shows an initial window', function () {
    return this.app.client.getWindowCount().then(function (count) {
      assert.equal(count, 1);
    });
  });

  it('Source code', function () {
    return this.app.client.getSource().then(function (text) {
      assert.ok(text.includes('<li id="menu-search" class="button fa fa-search" title="Suche (Tastenkürzel: Esc)"></li>'));
    });
  });

  it.skip('get text', function () {
    return this.app.client.moveTo('#slide').then((text) => {
      return this.app.client.click('#menu-tableofcontents').then((test) => {
        return this.app.client.getText('#tableofcontents h2').then(function (text) {
          assert.equal(text, 'Inhaltsverzeichnis');
        });
      });
    });
  });

  it('get html', function () {
    return this.app.client.getHTML('#update-library').then(function (text) {
      assert.equal(text, '<a id="update-library" class="button">Die Liedersammlung aktualisieren</a>');
    });
  });

  it('getTitle', function () {
    return this.app.client.getTitle().then(function (text) {
      assert.equal(text, 'Liederbuch „Die besten Lieder“');
    });
  });

  it('elements', function () {
    return this.app.client.elements('li').then(function (options) {
      console.log(options);
    });
  });

  it('div .option', function () {
    return this.app.client.$$('div .option').then(function (options) {
      console.log(options);
    });
  });

});
