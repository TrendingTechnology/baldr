const assert = require('assert');
const path = require('path');
const Masters = require('../lib/masters.js').Masters;
const masters = new Masters();
const rewire = require('rewire')('../lib/masters.js');
Master = rewire.__get__('Master');
const master = new Master('quote');

let all = [
  'audio',
  'camera',
  'person',
  'question',
  'quote',
  'svg'
];

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
