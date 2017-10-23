const assert = require('assert');
const quote = require('../index.js');
const jsdom = require('jsdom');
const {JSDOM} = jsdom;

function getDOM(html) {
  let d = new JSDOM(html);
  return d.window.document;
}

describe('Master slide “person”', () => {

  it('function “render(): all values”', () => {
    let html = quote.render({
      text: 'text',
      author: 'author',
      date: 'date'
    });

    let doc = getDOM(html);
    assert.ok(html.includes('text'));
    assert.equal(
      doc.querySelector('.text').textContent,
      '» text «'
    );

  });

});
