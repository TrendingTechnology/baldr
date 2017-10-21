const assert = require('assert');
const rewire = require('rewire')('../yml.js');

describe('function “loadYaml()”', () => {
  it('presentation.yml', () => {
    let loadYaml = rewire.__get__('loadYaml');
    let yml = loadYaml('presentation.yml');
    assert.equal(yml[0].quote.author, 'Johann Wolfgang von Goethe');
    assert.equal(yml[1].question[0].answer, 1827);
  });
});
