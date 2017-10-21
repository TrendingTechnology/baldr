const assert = require('assert');
const rewire = require('rewire')('../render.js');
const jsdom = require('jsdom');
const {JSDOM} = jsdom;

const requireMaster = rewire.__get__('requireMaster');

function getDOM(html) {
  let d = new JSDOM(html);
  return d.window.document;
}

describe('masters', () => {

  it('quote', () => {
    let quote = requireMaster('quote');
    let html = quote.render({
      text: 'text',
      author: 'author',
      date: 'date'
    });

    let document = getDOM(html);
    assert.equal(
      document.querySelector('h1').textContent,
      'author, date'
    );
    assert.equal(
      document.querySelector('p').textContent,
      'text'
    );

  });

});
