const assert = require('assert');
const path = require('path');
const fs = require('fs');
const Masters = require('../lib/masters.js').Masters;
const MasterOfMasters = require('../lib/masters.js').MasterOfMasters;
const masters = new Masters();
const rewire = require('rewire')('../lib/masters.js');
Master = rewire.__get__('Master');
const master = new Master('quote');

const {JSDOM} = require('jsdom');

function getDOM(html) {
  let d = new JSDOM(html);
  return d.window.document;
}

let all = [
  'audio',
  'camera',
  'editor',
  'person',
  'question',
  'quote',
  'svg'
];

describe('Class “MasterOfMasters”', function() {
  beforeEach(function() {
    this.mom = new MasterOfMasters(
      getDOM(
        fs.readFileSync(
          path.join(__dirname, '..', 'render.html'),
          'utf8'
        )
      )
    );
  });

  it('Instantiation', function() {
    assert.equal(typeof MasterOfMasters, 'function');
    assert.equal(typeof this.mom, 'object');
  });

  describe('Properties', function() {
    it('Property “document”', function() {
      assert.equal(typeof this.mom.document, 'object');
    });

    it('Property “elemSlide”', function() {
      assert.equal(this.mom.elemSlide.id, 'slide');
      assert.equal(this.mom.elemSlide.nodeName, 'DIV');
      assert.equal(this.mom.elemSlide.nodeType, 1);
    });
  });

  describe('Methods', function() {
    it('Method “hasCSS()”', function() {
      assert.equal(typeof this.mom.hasCSS, 'function');
      assert.equal(this.mom.hasCSS(), false);
    });

    it('Method “setCSS()”', function() {
      this.mom.setCSS();
      assert.equal(
        this.mom.document.querySelector('link#current-master'),
        null
      );
    });

    it('Method “set()”', function() {
      this.mom.set();
      assert.equal(
        this.mom.elemSlide.innerHTML,
        'No slide loaded.'
      );
    });
  });

});


describe('Class “Master()”', () => {

  describe('Properties', () => {

    it('this.name', () => {
      assert.equal(master.name, 'quote');
    });

    it('this.path', () => {
      assert.equal(
        master.path,
        path.resolve(__dirname, '..', 'masters', 'quote')
      );
    });

    it('this.render()', () => {
      assert.equal(
        typeof master.render,
        'function'
      );
    });

    it('this.postRender()', () => {
      assert.equal(
        typeof master.postRender,
        'function'
      );
    });

    it('this.css', () => {
      assert.equal(master.css, 'styles.css');
    });

  });

});

describe('Class “Masters()”', () => {

  describe('Properties', () => {

    it('this.path', () => {
      assert.equal(
        masters.path,
        path.resolve(__dirname, '..', 'masters')
      );
    });

    it('this.all', () => {
      assert.deepEqual(masters.all, all);
    });

    it('[master].render()', () => {
      for (let master of all) {
        assert.equal(typeof masters[master].render, 'function');
      }
    });

    it('[master].postRender()', () => {
      for (let master of all) {
        assert.equal(typeof masters[master].postRender, 'function');
      }
    });

  });

  it('Method “getModules()”', () => {
    assert.deepEqual(masters.getModules(), all);
  });

});
