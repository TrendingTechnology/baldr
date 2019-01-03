const {
  assert,
  Spectron
} = require('@bldr/test-helper')

describe('Master slide “editor”: “example.baldr” #spectron', function () {
  this.timeout(40000)

  beforeEach(function () {
    this.spectron = new Spectron('@bldr/electron-app', 'masters/editor/example.baldr')
    this.app = this.spectron.getApp()
    return this.spectron.start()
  })

  afterEach(function () {
    return this.spectron.stop()
  })

  it.skip('Basic navigation', function () {
    return this.app.client
      .getHTML('.ct-app')
      .then(text => { assert.ok(text.includes('ct-ignition__button--edit')) })

      .click('#nav-slide-next')
      .getText('#slide-content')
      .then(text => { assert.equal(text, 'test') })

      .keys(['Control', 'Alt', 'e'])
      .getHTML('.ct-app')
      .then(text => { assert.ok(text.includes('ct-ignition__button--edit')) })

      .click('#nav-slide-prev')
      .getHTML('.ct-app')
      .then(text => { assert.ok(text.includes('ct-ignition__button--edit')) })
  })
})
