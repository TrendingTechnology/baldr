const {
  assert,
  fs,
  path,
  testFileMinimal
} = require('baldr-test');

const {getConfig} = require(
  path.join(__dirname, '..', 'config.js')
);
let config;

describe('Class “Config()” #unittest', () => {

  beforeEach(() => {
    config = getConfig([testFileMinimal]);
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

    it('Method “pickSessionFile()”', () => {

      assert.equal(
        config.pickSessionFile(['lol.baldr']),
        'lol.baldr'
      );

      assert.equal(
        config.pickSessionFile(['lol.BALDR']),
        'lol.BALDR'
      );

      assert.equal(
        config.pickSessionFile(['lil', 'lol.BALDR', 'troll']),
        'lol.BALDR'
      );

      assert.throws(function() {
        config.pickSessionFile(['lil', 'troll']);
      });

      assert.equal(
        config.pickSessionFile(['first.baldr', 'last.baldr']),
        'last.baldr'
      );
    });

  });

});
