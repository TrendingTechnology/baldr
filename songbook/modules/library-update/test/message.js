const {assert} = require('./lib/helper.js');
const sinon = require('sinon');
const message = require('../message.js');
const rewire = require('rewire')('../message.js');

describe('message.js', () => {

  it('"info()"', () => {
    stub = sinon.stub();
    rewire.__set__('info', stub);
    let info = rewire.__get__('info');
    info('lol');
    assert.equal(info.called, true);
  });

  it('const “arrow”', () => {
    let arrow = rewire.__get__('arrow');
    assert.equal(arrow, '\u001b[32m✓\u001b[39m');
  });

  it('const “warning”', () => {
    let warning = rewire.__get__('warning');
    assert.equal(warning, '\u001b[33mWarning! \u001b[39m');
  });

  it('const “error”', () => {
    let error = rewire.__get__('error');
    assert.equal(error, '\u001b[31mError! \u001b[39m');
  });

});
