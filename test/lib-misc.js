const assert = require('assert');
const path = require('path');
const misc = require('../lib/misc.js');

describe('Other functions', () => {

  it('Function “searchForBaldrFile()”', () => {
    let search = misc.searchForBaldrFile;
    assert.equal(
      search(['lol.baldr']),
      'lol.baldr'
    );

    assert.equal(
      search(['lol.BALDR']),
      'lol.BALDR'
    );

    assert.equal(
      search(['lil', 'lol.BALDR', 'troll']),
      'lol.BALDR'
    );

    assert.equal(
      search(['lil', 'troll']),
      false
    );

    assert.equal(
      search(['first.baldr', 'last.baldr']),
      'last.baldr'
    );
  });
});
