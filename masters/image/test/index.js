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

describe('Master slide “image”', () => {

  it.skip('', () => {

  });


});
