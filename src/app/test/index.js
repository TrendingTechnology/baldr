const {
  assert,
  getDOM,
  fs,
  path,
  testFileMinimal,
  rewire,
  srcPath
} = require('baldr-test')

const { ShowRunner } = require('baldr-application')
const mousetrap = require('mousetrap')

/***********************************************************************
 *
 **********************************************************************/

describe('Class “Environment()” #unittest', () => {
  let indexJsPath = srcPath('app', 'index.js')
  const Environment = rewire(indexJsPath).__get__('Environment')
  let env = new Environment([testFileMinimal], getDOM())

  it('config', () => {
    assert.equal(typeof env.config, 'object')
    assert.equal(env.config.constructor.name, 'Config')
  })

  it('document', () => {
    assert.equal(typeof env.document, 'object')
    assert.equal(env.document.constructor.name, 'Document')
  })

  it('masters', () => {
    assert.equal(typeof env.masters, 'object')
    assert.equal(env.masters.constructor.name, 'Masters')
  })

  it('themes', () => {
    assert.equal(typeof env.themes, 'object')
    assert.equal(env.themes.constructor.name, 'Themes')
  })
})

/***********************************************************************
 *
 **********************************************************************/

describe('Class “ShowRunner()” #unittest', () => {
  let show

  beforeEach(() => {
    show = new ShowRunner([testFileMinimal], getDOM(), mousetrap)
  })

  describe('Properties', () => {
    it('Property “this.config.sessionFile', () => {
      assert.ok(fs.existsSync(show.env.config.sessionFile))
    })

    it('Property “this.env', () => {
      assert.equal(typeof show.env, 'object')
      assert.equal(show.env.constructor.name, 'Environment')
    })

    it('Property “this.config.raw', () => {
      assert.equal(typeof show.env.config.raw, 'object')
    })

    it('Property “this.slides[1].master.name', () => {
      assert.equal(show.slides[1].master.name, 'quote')
    })

    it('Property “this.slidesSwitcher.count', () => {
      assert.equal(show.slidesSwitcher.count, 3)
    })

    it('Property “this.slidesSwitcher.no', () => {
      assert.equal(show.slidesSwitcher.no, 1)
    })

    it('Property “this.config.sessionDir', () => {
      assert.equal(
        show.env.config.sessionDir,
        path.resolve(path.dirname(testFileMinimal))
      )
    })

    it('Property “this.newSlide.master.name”', () => {
      assert.equal(
        show.newSlide.master.name, 'quote'
      )
    })

    it('Property “this.quickStart', () => {
      assert.equal(typeof show.quickStart, 'object')
    })
  })

  describe('Methods', () => {
    it('Method “slidePrev()”', () => {
      show.slidePrev()
      assert.equal(show.slidesSwitcher.no, 3)
      show.slidePrev()
      assert.equal(show.slidesSwitcher.no, 2)
      show.slidePrev()
      assert.equal(show.slidesSwitcher.no, 1)
      show.slidePrev()
      assert.equal(show.slidesSwitcher.no, 3)
    })

    it('Method “slideNext()”', () => {
      show.slideNext()
      assert.equal(show.slidesSwitcher.no, 2)
      show.slideNext()
      assert.equal(show.slidesSwitcher.no, 3)
      show.slideNext()
      assert.equal(show.slidesSwitcher.no, 1)
      show.slideNext()
      assert.equal(show.slidesSwitcher.no, 2)
    })
  })
})
