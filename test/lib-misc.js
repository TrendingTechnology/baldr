const {
  assert,
  path
} = require('baldr-test');

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

    assert.throws(function() {search(['lil', 'troll']);});

    assert.equal(
      search(['first.baldr', 'last.baldr']),
      'last.baldr'
    );
  });
});
