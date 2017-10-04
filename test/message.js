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

  it('"noConfigPath()"', () => {
    stub = sinon.stub();

    let revert = rewire.__set__('info', stub);
    noConfigPath = rewire.__get__('noConfigPath');

    try {
      noConfigPath();
    }
    catch (e) {
      assert.equal(e.message, 'No configuration file found.');
    }
    assert.equal(stub.called, true);
    assert.deepEqual(stub.args, [
      [ '\u001b[31mError! \u001b[39mNo config file ' +
        '\'~/html5-school-presentation.json\' found!\nCreate a ' +
        'config file with this keys:\n{\n\t"songbook": ' +
        '{\n\t\t"path": "/Users/jf/Desktop/school/Lieder",' +
        '\n\t\t"json": "songs.json",\n\t\t"info": "info.json",' +
        '\n\t\t"slidesFolder": "slides",\n\t}\n}\n'
      ]
    ]);
  });

});
