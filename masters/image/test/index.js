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
      assert.deepEqual(
        image.normalizeData('images/beethoven.jpg'),
        [resolveImage('images', 'beethoven.jpg')]
      );
    });

    it('Single file as array', () => {
      assert.deepEqual(
        image.normalizeData(['images/beethoven.jpg']),
        [resolveImage('images', 'beethoven.jpg')]
      );
    });

    it('Single folder as string', () => {
      assert.deepEqual(
        image.normalizeData('images'),
        [
          resolveImage('images', 'beethoven.jpg'),
          resolveImage('images', 'haydn.jpg'),
          resolveImage('images', 'mozart.jpg')
        ]
      );
    });

    it('Single folder as array', () => {
      assert.deepEqual(
        image.normalizeData(['images']),
        [
          resolveImage('images', 'beethoven.jpg'),
          resolveImage('images', 'haydn.jpg'),
          resolveImage('images', 'mozart.jpg')
        ]
      );
    });

    it('Multiple folders as array', () => {
      assert.deepEqual(
        image.normalizeData(['images', 'images2']),
        [
          resolveImage('images', 'beethoven.jpg'),
          resolveImage('images', 'haydn.jpg'),
          resolveImage('images', 'mozart.jpg'),
          resolveImage('images2', 'beethoven.jpg'),
          resolveImage('images2', 'haydn.jpg'),
          resolveImage('images2', 'mozart.jpg')
        ]
      );
    });

  });

});
