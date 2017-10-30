const assert = require('assert');
const fs = require('fs');
const path = require('path');
const quote = require('../index.js');
const Master = quote.Master;
const {JSDOM} = require('jsdom');

function getDOM(html) {
  let d = new JSDOM(html);
  return d.window.document;
}

describe('Master slide “quote”', () => {

  it('function “render()”: all values', () => {
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

  it('function “render()”: no author', () => {
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

  it('function “render()”: no date', () => {
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

  it('function “render()”: only text', () => {
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

describe('Class “Master”', function() {
  beforeEach(function() {
    this.document = getDOM(
      fs.readFileSync(
        path.join(__dirname, '..', '..', '..', 'render.html'),
        'utf8'
      )
    );
    this.data = {text: 'text', author: 'author'};
    this.quote = new Master(this.document, this.data);
  });

  it('Class', function() {
    assert.equal(typeof Master, 'function');
  });

  it('Property “innerHTML”', function() {
    let render = this.quote.render({text: 'text', author: 'author'});
    this.quote.set();
    assert.equal(this.quote.elemSlide.innerHTML, render);
  });

  it('Method “hasCSS”', function() {
    assert.equal(this.quote.hasCSS(), true);
  });

});
