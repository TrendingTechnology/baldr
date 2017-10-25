const assert = require('assert');
const rewire = require('rewire')('../presentation.js');
const path = require('path');
const {Presentation} = require('../presentation.js');

describe('Other functions', () => {

  it('Function “searchForBaldrFile()”', () => {
    let search = rewire.__get__('searchForBaldrFile');
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
