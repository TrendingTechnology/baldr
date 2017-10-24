const assert = require('assert');

const masters = require('../lib/masters.js');

let m = new masters.Masters();


describe('Class “Masters()”', () => {

  it('Properties', () => {
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
