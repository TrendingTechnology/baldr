const assert = require('assert');
const fs = require('fs');
const path = require('path');
const {MasterQuote} = require('../index.js');
const {document, presentation, getDOM} = require('../../../test/lib/helper.js');

let propObj = {
  masterName: 'quote',
  masterPath: path.resolve(__dirname, '..'),
  document: document,
  presentation: presentation
};

let render = function(data) {
  propObj.data = data;
  let quote = new MasterQuote(propObj);
  return quote.setHTMLSlide();
};

describe('Master slide “quote”', () => {

  it('function “setHTMLSlide()”: all values', () => {
    let html = render({
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

  it('function “setHTMLSlide()”: no author', () => {
    let html = render({
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

  it('function “setHTMLSlide()”: no date', () => {
    let html = render({
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

  it('function “setHTMLSlide()”: only text', () => {
    let html = render({
      text: 'text'
    });
    let doc = getDOM(html);
    assert.equal(
      doc.querySelector('.attribution'),
      null
    );
  });

});
