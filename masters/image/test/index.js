const {
  assert,
  document,
  path,
  presentation,
  getDOM
} = require('baldr-test');

const {MasterImage} = require('../index.js');

let propObj = {
  masterName: 'image',
  masterPath: path.resolve(__dirname, '..'),
  document: document,
  presentation: presentation
};

let getImage = function(data) {
  propObj.data = data;
  return new MasterImage(propObj);
};

describe('Master slide “image”: unit tests', () => {

  it.skip('method normalizeData()', () => {
    let image = getImage('beethoven.jpg');

    assert.deepEqual(
      image.normalizeData('beethoven.jpg')
      [path.resolve('test/files/beethoven.jpg')]
    );

  });


});
