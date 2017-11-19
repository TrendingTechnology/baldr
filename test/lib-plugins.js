const {
  assert,
  returnDOM,
  presentation
} = require('baldr-test');

const {Plugins} = require('../lib/plugins.js');

let initPlugins = function() {
  return new Plugins(returnDOM(), presentation);
};

let plugins;

describe('Class “Plugins()”', () => {

  beforeEach(() => {
    plugins = initPlugins();
  });

  describe('Properties', () => {

    it('Property “this.all”', () => {
      assert.deepEqual(plugins.all, ['audio']);
    });

    it('Property “this.audio.state.media”', () => {
      assert.equal(plugins.audio.state.media.length, 3);
    });

  });

  describe('Methods', () => {

    it('Method “getHooks()”', () => {
      assert.deepEqual(
        plugins.getHooks('mediaTypesExtensions', 'object'),
        ['audio']
      );

      assert.deepEqual(
        plugins.getHooks('getDocument'),
        ['audio']
      );

      assert.deepEqual(
        plugins.getHooks('XxX'),
        []
      );
    });

  });

});
