const {
  assert,
  Spectron
} = require('@bldr/test-helper')

describe('application launch', function () {
  this.timeout(10000)

  beforeEach(function () {
    this.spectron = new Spectron('@bldr/camera-electron-app', 'test/files/steps.baldr')
    this.app = this.spectron.getApp()
    return this.spectron.start()
  })

  afterEach(function () {
    return this.spectron.stop()
  })

  it('shows an initial window', function () {
    return this.app.client.getWindowCount().then(function (count) {
      assert.strictEqual(count, 1)
    })
  })

  it('CSS property: background-color', function () {
    return this.app.client.$('body').getCssProperty('background-color').then(function (color) {
      assert.strictEqual(color.value, 'rgba(0,0,0,1)')
    })
  })
})
