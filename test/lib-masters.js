const assert = require('assert');
const path = require('path');
const masters = require('../lib/masters.js');

let m = new masters.Masters();

describe('Class “Masters()”', () => {

  describe('Properties', () => {

    it('this.path', () => {
      assert.equal(
        m.path,
        path.resolve(__dirname, '..', 'masters')
      );
    });

    it('this.all', () => {
      assert.deepEqual(
        m.all,
        [
          'audio',
          'person',
          'question',
          'quote',
          'svg'
      ]);
    });

  });

  it('Method “getModules()”', () => {
    assert.deepEqual(
      m.getModules(),
      [
        'audio',
        'person',
        'question',
        'quote',
        'svg'
    ]);
  });

});
