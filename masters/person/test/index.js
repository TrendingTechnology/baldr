const {
  assert,
  path,
  document,
  presentation,
  getDOM
} = require('baldr-test');

const {MasterPerson} = require('../index.js');

presentation.pwd = '/home/bladr';

let propObj = {
  masterName: 'person',
  masterPath: path.resolve(__dirname, '..'),
  document: document,
  presentation: presentation
};

let render = function(data) {
  propObj.data = data;
  let person = new MasterPerson(propObj);
  return person.hookSetHTMLSlide();
};

describe('Master slide “person”', () => {

  it('function “hookSetHTMLSlide()”', () => {

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
