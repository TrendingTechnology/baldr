var assert = require('assert');
var index = require('../index.js');

describe('loadYaml()', function() {
  it('test.yml', function() {
    var yml = index.loadYaml('test/test.yml');
    assert.equal(yml[0].quote.author, 'Johann Wolfgang von Goethe');
    assert.equal(yml[1].quote.author, 'Marcus Tullius Cicero')
  });
});
