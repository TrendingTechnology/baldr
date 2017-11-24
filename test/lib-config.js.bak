const {
  assert,
  fs,
  path,
  testFileMinimal
} = require('baldr-test');

const {Config} = require('../lib/config.js');

let initConfig = function() {
  return new Config(testFileMinimal);
};

let presentation;

describe('Class “Config()”', () => {

  beforeEach(() => {
    config = initConfig();
  });

  describe('Properties', () => {

    it('Property “this.sessionFile”', () => {
      assert.ok(fs.existsSync(config.sessionFile));
    });

    it('Property “this.raw”', () => {
      assert.equal(typeof config.raw, 'object');
    });

    it('of the YAML file are properties of the class Config()', () => {
      assert.equal(typeof config.slides, 'object');
      assert.equal(config.masters.audio[0], 'media/audio/beethoven.mp3');
    });

  });

  describe('Methods', () => {

    it('Method “parseYamlFile()”', () => {
      let yml = config.parseYamlFile(testFileMinimal);
      assert.equal(yml.slides[0].quote.author, 'Johann Wolfgang von Goethe');
      assert.equal(yml.slides[1].question, 'When did Ludwig van Beethoven die?');
    });

  });

});
