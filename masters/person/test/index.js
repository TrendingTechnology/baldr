const assert = require('assert');
const person = require('../index.js');

const jsdom = require('jsdom');
const {JSDOM} = jsdom;

function getDOM(html) {
  let d = new JSDOM(html);
  return d.window.document;
}

describe('Master slide “person”', () => {

  it('function “render()”', () => {
    let presentation = {pwd: '/home/bladr'};

    let html = person.render({
      name: 'Ludwig van Beethoven',
      image: 'beethoven.jpg'
    }, presentation);

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
