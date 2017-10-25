const assert = require('assert');
const path = require('path');
const masters = require('../lib/masters.js');

let m = new masters.Masters();
let all = [
  'audio',
  'person',
  'question',
  'quote',
  'svg'
];

describe('Class “Masters()”', () => {

  describe('Properties', () => {

    it('this.path', () => {
      assert.equal(
        m.path,
        path.resolve(__dirname, '..', 'masters')
      );
    });

    it('this.all', () => {
      assert.deepEqual(m.all, all);
    });

    it('[master].render()', () => {
      for (let master of all) {
        assert.equal(typeof m[master].render, 'function');
      }
    });

  });

  it('Method “getModules()”', () => {
    assert.deepEqual(m.getModules(), all);
  });

});
