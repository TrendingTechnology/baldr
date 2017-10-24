const assert = require('assert');
const quote = require('../index.js');
const jsdom = require('jsdom');
const {JSDOM} = jsdom;

function getDOM(html) {
  let d = new JSDOM(html);
  return d.window.document;
}

describe('Master slide “person”', () => {

  it.skip('function “render()”', () => {
    let html = quote.render({
      name: 'Ludwig van Beethoven',
      image: 'beethoven.jpg'
    });

    let doc = getDOM(html);
    assert.equal(
      doc.querySelector('#info-box p').textContent,
      'Ludwig van Beethoven'
    );

  });

});
