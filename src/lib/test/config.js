const {
  assert,
  fs,
  path,
  testFileMinimal
} = require('baldr-test')

const { getConfig } = require(
  path.join(__dirname, '..', 'config.js')
)
let config

describe('Class “Config()” #unittest', () => {
  beforeEach(() => {
    config = getConfig([testFileMinimal])
  })

  describe('Properties', () => {
    it('Property “this.sessionFile”', () => {
      assert.ok(fs.existsSync(config.sessionFile))
    })

    it('Property “this.raw”', () => {
      assert.equal(typeof config.raw, 'object')
    })

    it('of the YAML file are properties of the class Config()', () => {
      assert.equal(typeof config.slides, 'object')
    })
  })

  describe('Methods', () => {
    it('Method “parseYamlFile_()”', () => {
      let yml = config.parseYamlFile_(testFileMinimal)
      assert.equal(yml.slides[0].quote.author, 'Johann Wolfgang von Goethe')
      assert.equal(yml.slides[1].question, 'When did Ludwig van Beethoven die?')
    })

    it('Method “pickSessionFile_()”', () => {
      assert.equal(
        config.pickSessionFile_(['lol.baldr']),
        'lol.baldr'
      )

      assert.equal(
        config.pickSessionFile_(['lol.BALDR']),
        'lol.BALDR'
      )

      assert.equal(
        config.pickSessionFile_(['lil', 'lol.BALDR', 'troll']),
        'lol.BALDR'
      )

      assert.throws(function () {
        config.pickSessionFile_(['lil', 'troll'])
      })

      assert.equal(
        config.pickSessionFile_(['first.baldr', 'last.baldr']),
        'last.baldr'
      )
    })
  })
})
