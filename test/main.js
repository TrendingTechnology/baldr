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

  it.skip('tableofcontent', function () {
    return this.app.client.moveTo('#slide')
      .click('#menu-tableofcontents')
      .getText('#tableofcontents h2').then(function (text) {
          assert.equal(text, 'Inhaltsverzeichnis');
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

  it.skip('get html', function () {
    return this.app.client.getHTML('#update-library').then(function (text) {
      assert.equal(text, '<a id="update-library" class="button">Die Liedersammlung aktualisieren</a>');
    });
  });

  it('HTML title', function () {
    return this.app.client.getTitle().then(function (text) {
      assert.equal(text, 'Liederbuch „Die besten Lieder“');
    });
  });

  it('selectize control field', function () {
    return this.app.client.element('.selectize-control').then(function (field) {
      assert.ok(field.value.ELEMENT);
    });
  });

  it('selectize dropdown content', function () {
    return this.app.client.$$('.selectize-dropdown-content .option').then(function (options) {
      assert.equal(options.length, 4);
    });
  });

});
