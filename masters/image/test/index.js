const {
  assert,
  document,
  path,
  presentation,
  Presentation,
  getDOM
} = require('baldr-test');

const {MasterImage} = require('../index.js');

let propObj = {
  masterName: 'image',
  masterPath: path.resolve(__dirname, '..'),
  document: document,
  presentation: new Presentation(
    path.resolve(__dirname, '..', 'example.baldr'),
    document
  )
};

let getImage = function(data) {
  propObj.data = data;
  return new MasterImage(propObj);
};

let resolveImage = function(imagePath, image) {
  return path.resolve('masters', 'image', imagePath, image);
};

let image = getImage('images/beethoven.jpg');

describe('Master slide “image”: unit tests', () => {

  describe('method normalizeData()', () => {

    it('Single file as string', () => {
      let out = image.normalizeData('images/beethoven.jpg');
      assert.equal(out[0].basename, 'beethoven.jpg');
    });

    it('Single file as array', () => {
      let out = image.normalizeData(['images/beethoven.jpg']);
      assert.equal(out[0].basename, 'beethoven.jpg');
    });

    it('Single folder as string', () => {
      let out = image.normalizeData('images');
      assert.equal(out[0].basename, 'beethoven.jpg');
      assert.equal(out[1].basename, 'haydn.jpg');
      assert.equal(out[2].basename, 'mozart.jpg');
    });

    it('Single folder as array', () => {
      let out = image.normalizeData(['images']);
      assert.equal(out[0].basename, 'beethoven.jpg');
      assert.equal(out[1].basename, 'haydn.jpg');
      assert.equal(out[2].basename, 'mozart.jpg');
    });

    it('Multiple folders as array', () => {
      let out = image.normalizeData(['images', 'images2']);
      assert.equal(out[0].basename, 'beethoven.jpg');
      assert.equal(out[1].basename, 'haydn.jpg');
      assert.equal(out[2].basename, 'mozart.jpg');
      assert.equal(out[3].basename, 'beethoven.jpg');
      assert.equal(out[4].basename, 'haydn.jpg');
      assert.equal(out[5].basename, 'mozart.jpg');
    });

  });

});
