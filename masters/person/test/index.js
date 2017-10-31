const assert = require('assert');
const path = require('path');
const {Master} = require('../index.js');
const {document, presentation, getDOM} = require('../../../test/lib/helper.js');

presentation.pwd = '/home/bladr';

let propObj = {
  masterName: 'person',
  masterPath: path.resolve(__dirname, '..'),
  document: document,
  presentation: presentation
};

let render = function(data) {
  propObj.data = data;
  let person = new Master(propObj);
  return person.render();
};

describe('Master slide “person”', () => {

  it('function “render()”', () => {

    let html = render({
      name: 'Ludwig van Beethoven',
      image: 'beethoven.jpg'
    });

    let doc = getDOM(html);
    assert.equal(
      doc.querySelector('#info-box p').textContent,
      'Ludwig van Beethoven'
    );

    assert.equal(
      doc.querySelector('img').getAttribute('src'),
      '/home/bladr/beethoven.jpg'
    );

  });

});
