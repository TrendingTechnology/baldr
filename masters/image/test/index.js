const {
  assert,
  document,
  path,
  cloneConfig
} = require('baldr-test');

const image = require('../index.js');

let config = cloneConfig();
config.sessionDir = path.resolve(__dirname, '..');

describe('Master slide “image” #unittest', () => {

  describe('method normalizeData()', () => {

    it('Single file as string', () => {
      let out = image.normalizeData('images/beethoven.jpg', config);
      assert.equal(out[0].basename, 'beethoven.jpg');
    });

    it('Single file as array', () => {
      let out = image.normalizeData(['images/beethoven.jpg'], config);
      assert.equal(out[0].basename, 'beethoven.jpg');
    });

    it('Single folder as string', () => {
      let out = image.normalizeData('images', config);
      assert.equal(out[0].basename, 'beethoven.jpg');
      assert.equal(out[1].basename, 'haydn.jpg');
      assert.equal(out[2].basename, 'mozart.jpg');
    });

    it('Single folder as array', () => {
      let out = image.normalizeData(['images'], config);
      assert.equal(out[0].basename, 'beethoven.jpg');
      assert.equal(out[1].basename, 'haydn.jpg');
      assert.equal(out[2].basename, 'mozart.jpg');
    });

    it('Multiple folders as array', () => {
      let out = image.normalizeData(['images', 'images2'], config);
      assert.equal(out[0].basename, 'beethoven.jpg');
      assert.equal(out[1].basename, 'haydn.jpg');
      assert.equal(out[2].basename, 'mozart.jpg');
      assert.equal(out[3].basename, 'beethoven.jpg');
      assert.equal(out[4].basename, 'haydn.jpg');
      assert.equal(out[5].basename, 'mozart.jpg');
    });

  });

});
