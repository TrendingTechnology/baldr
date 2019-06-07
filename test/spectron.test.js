const {
  assert,
  fs,
  Spectron
} = require('@bldr/test-helper')

describe('General Spectron tests #spectron', () => {
  describe('build', () => {
    it(`exists “Spectron.appPath”`, function () {
      this.timeout(50000)
      let spectron = new Spectron('@bldr/electron-app')
      assert.ok(fs.existsSync(spectron.appPath))
    })
  })

  describe('Lauch without baldr file', function () {
    beforeEach(function () {
      this.timeout(50000)
      this.spectron = new Spectron('@bldr/electron-app')
      this.app = this.spectron.getApp()
      return this.spectron.start()
    })

    afterEach(function () {
      return this.spectron.stop()
    })

    it('Initial window', function () {
      return this.app.client
        .getWindowCount()
        .then(count => {
          assert.equal(count, 1)
        })
        .getTitle()
        .then(text => {
          assert.equal(text, 'baldr')
        })
        .getText('#slide').then(text => {
          assert.ok(text.includes('Uncaught Error: No presentation file with the extension *.baldr found!'))
        })
    })
  })

  describe('Launch minimal.baldr', function () {
    this.timeout(50000)

    beforeEach(function () {
      this.spectron = new Spectron('@bldr/electron-app', 'test/files/minimal.baldr')
      this.app = this.spectron.getApp()
      return this.spectron.start()
    })

    afterEach(function () {
      return this.spectron.stop()
    })

    it('Initial window', function () {
      return this.app.client
        .getText('.author').then(text => {
          assert.equal(text, 'Johann Wolfgang von Goethe')
        })
        .getCssProperty('.author', 'font-family').then(style => {
          assert.equal(style.value, 'alegreya sc')
        })
        .getCssProperty('button', 'color').then(style => {
          assert.equal(style[0].parsed.hex, '#808080')
        })

        .click('#nav-slide-next')
        .getText('.question')
        .then(text => {
          assert.equal(text, 'When did Ludwig van Beethoven die?')
        })

        .click('#nav-slide-next')
        .getText('.person')
        .then(text => {
          assert.equal(text, 'Ludwig van Beethoven')
        })
    })

    it('Quick start shortcuts', function () {
      return this.app.client

        .keys('ArrowRight')
        .getText('.question')
        .then(text => {
          assert.equal(text, 'When did Ludwig van Beethoven die?')
        })

        .keys('ArrowRight')
        .getText('.person')
        .then(text => {
          assert.equal(text, 'Ludwig van Beethoven')
        })

        .keys(['Control', 'Alt', 'c'])
        .getHTML('video')
        .then(text => {
          assert.ok(text.includes('<video'))
        })
    })

    it('Modal window', function () {
      return this.app.client

        .click('#modal-open button')
        .getCssProperty('#modal', 'display').then(style => {
          assert.equal(style.value, 'block')
        })

        .click('#modal-open button')
        .getCssProperty('#modal', 'display').then(style => {
          assert.equal(style.value, 'none')
        })

        .click('#modal-open button')
        .getCssProperty('#modal', 'display').then(style => {
          assert.equal(style.value, 'block')
        })

        .click('#modal-close')
        .getCssProperty('#modal', 'display').then(style => {
          assert.equal(style.value, 'none')
        })

        .keys('Escape')
        .getCssProperty('#modal', 'display').then(style => {
          assert.equal(style.value, 'block')
        })

        .keys('Escape')
        .getCssProperty('#modal', 'display').then(style => {
          assert.equal(style.value, 'none')
        })
    })
  })

  describe('Launch steps.baldr', function () {
    this.timeout(50000)

    beforeEach(function () {
      this.spectron = new Spectron('@bldr/electron-app', 'test/files/steps.baldr')
      this.app = this.spectron.getApp()
      return this.spectron.start()
    })

    afterEach(function () {
      return this.spectron.stop()
    })

    it('General step functionality, nextStep', function () {
      return this.app.client
        .getText('li:nth-child(1) .question').then(text => {
          assert.equal(text, 'one')
        })
        .getText('li:nth-child(2) .question').then(text => {
          assert.equal(text, '')
        })
        .getText('li:nth-child(3) .question').then(text => {
          assert.equal(text, '')
        })

        .click('#nav-step-next')
        .getText('li:nth-child(2) .question').then(text => {
          assert.equal(text, 'two')
        })

        .click('#nav-step-next')
        .getText('li:nth-child(3) .question').then(text => {
          assert.equal(text, 'three')
        })

        .keys('ArrowDown')
        .getText('li:nth-child(1) .question').then(text => {
          assert.equal(text, 'one')
        })
        .getText('li:nth-child(2) .question').then(text => {
          assert.equal(text, '')
        })
        .getText('li:nth-child(3) .question').then(text => {
          assert.equal(text, '')
        })
    })

    it('prevStep', function () {
      return this.app.client
        .click('#nav-step-prev')
        .getText('li:nth-child(1) .question').then(text => {
          assert.equal(text, 'one')
        })
        .getText('li:nth-child(2) .question').then(text => {
          assert.equal(text, 'two')
        })
        .getText('li:nth-child(3) .question').then(text => {
          assert.equal(text, 'three')
        })

        .click('#nav-step-prev')
        .getText('li:nth-child(3) .question').then(text => {
          assert.equal(text, '')
        })

        .click('#nav-step-prev')
        .getText('li:nth-child(2) .question').then(text => {
          assert.equal(text, '')
        })

        .keys('ArrowUp')
        .getText('li:nth-child(1) .question').then(text => {
          assert.equal(text, 'one')
        })
        .getText('li:nth-child(2) .question').then(text => {
          assert.equal(text, 'two')
        })
        .getText('li:nth-child(3) .question').then(text => {
          assert.equal(text, 'three')
        })
    })

    it('Step number is perserved on slide change', function () {
      return this.app.client
        .click('#nav-step-next')
        .getText('li:nth-child(1) .question').then(text => {
          assert.equal(text, 'one')
        })
        .getText('li:nth-child(2) .question').then(text => {
          assert.equal(text, 'two')
        })
        .getText('li:nth-child(3) .question').then(text => {
          assert.equal(text, '')
        })

        .click('#nav-slide-next')
        .getText('.question').then(text => {
          assert.equal(text, 'Without steps')
        })

        .click('#nav-slide-prev')
        .getText('li:nth-child(1) .question').then(text => {
          assert.equal(text, 'one')
        })
        .getText('li:nth-child(2) .question').then(text => {
          assert.equal(text, 'two')
        })
        .getText('li:nth-child(3) .question').then(text => {
          assert.equal(text, '')
        })
    })

    it('Visibility of the step buttons', function () {
      return this.app.client
        .getCssProperty('#nav-step-next', 'visibility').then(style => {
          assert.equal(style.value, 'visible')
        })
        .getCssProperty('#nav-step-prev', 'visibility').then(style => {
          assert.equal(style.value, 'visible')
        })
        .getCssProperty('#nav-slide-prev', 'visibility').then(style => {
          assert.equal(style.value, 'visible')
        })
        .getCssProperty('#nav-slide-next', 'visibility').then(style => {
          assert.equal(style.value, 'visible')
        })

        .click('#nav-slide-next')
        .getCssProperty('#nav-step-next', 'visibility').then(style => {
          assert.equal(style.value, 'hidden')
        })
        .getCssProperty('#nav-step-prev', 'visibility').then(style => {
          assert.equal(style.value, 'hidden')
        })

        .click('#nav-slide-prev')
        .getCssProperty('#nav-step-next', 'visibility').then(style => {
          assert.equal(style.value, 'visible')
        })
        .getCssProperty('#nav-step-prev', 'visibility').then(style => {
          assert.equal(style.value, 'visible')
        })
    })
  })

  describe('Launch single-slide.baldr', function () {
    this.timeout(50000)

    beforeEach(function () {
      this.spectron = new Spectron('@bldr/electron-app', 'test/files/single-slide.baldr')
      this.app = this.spectron.getApp()
      return this.spectron.start()
    })

    afterEach(function () {
      return this.spectron.stop()
    })

    it('Navigation buttons are hidden', function () {
      return this.app.client
        .getCssProperty('#nav-slide-prev', 'visibility').then(style => {
          assert.equal(style.value, 'hidden')
        })
        .getCssProperty('#nav-slide-next', 'visibility').then(style => {
          assert.equal(style.value, 'hidden')
        })
    })
  })

  describe('Launch error.baldr', function () {
    this.timeout(50000)

    beforeEach(function () {
      this.spectron = new Spectron('@bldr/electron-app', 'test/files/error.baldr')
      this.app = this.spectron.getApp()
      return this.spectron.start()
    })

    afterEach(function () {
      return this.spectron.stop()
    })

    it('Error text', function () {
      return this.app.client
        .click('#nav-slide-next')
        .getText('#slide').then(text => {
          assert.ok(text.includes('Uncaught Error: Master slide “question”: Invalid data input'))
        })
    })
  })

  describe('Launch themes.baldr', function () {
    this.timeout(50000)

    beforeEach(function () {
      this.spectron = new Spectron('@bldr/electron-app', 'test/files/themes.baldr')
      this.app = this.spectron.getApp()
      return this.spectron.start()
    })

    afterEach(function () {
      return this.spectron.stop()
    })

    it('Theme switching', function () {
      return this.app.client
        .getCssProperty('#slide-content p', 'color')
        .then(style => { assert.equal(style.parsed.hex, '#0000ff') })
        .getCssProperty('#slide-content p', 'font-family')
        .then(style => { assert.equal(style.value, 'kalam') })

        .click('#nav-slide-next')
        .getCssProperty('#slide-content p', 'color')
        .then(style => { assert.equal(style.parsed.hex, '#ffffff') })
        .getCssProperty('#slide-content p', 'font-family')
        .then(style => { assert.equal(style.value, 'alegreya') })

        .click('#nav-slide-next')
        .getCssProperty('#slide-content p', 'color')
        .then(style => { assert.equal(style.parsed.hex, '#ffffff') })
        .getCssProperty('#slide-content p', 'font-family')
        .then(style => { assert.equal(style.value, 'alegreya') })
    })
  })
})
