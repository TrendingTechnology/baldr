const assert = require('assert');
const quote = require('../index.js');
const jsdom = require('jsdom');
const {JSDOM} = jsdom;

function getDOM(html) {
  let d = new JSDOM(html);
  return d.window.document;
}

describe('Master slide “quote”', () => {

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
    assert.equal(
      doc.querySelector('#quotation-begin').textContent,
      '»'
    );
    assert.equal(
      doc.querySelector('#quotation-end').textContent,
      '«'
    );
    assert.equal(
      doc.querySelector('.attribution').textContent,
      'author, date'
    );
    assert.equal(
      doc.querySelector('.author').textContent,
      'author'
    );
    assert.equal(
      doc.querySelector('.date').textContent,
      'date'
    );
  });

  it('function “render(): no author”', () => {
    let html = quote.render({
      text: 'text',
      date: 'date'
    });
    let doc = getDOM(html);
    assert.equal(
      doc.querySelector('.date').textContent,
      'date'
    );
    assert.equal(
      doc.querySelector('.author'),
      null
    );
  });

  it('function “render(): no date”', () => {
    let html = quote.render({
      text: 'text',
      author: 'author'
    });
    let doc = getDOM(html);
    assert.equal(
      doc.querySelector('.author').textContent,
      'author'
    );
    assert.equal(
      doc.querySelector('.date'),
      null
    );
  });

  it('function “render(): only text”', () => {
    let html = quote.render({
      text: 'text'
    });
    let doc = getDOM(html);
    assert.equal(
      doc.querySelector('.attribution'),
      null
    );
  });

});
