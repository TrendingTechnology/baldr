const {
  assert,
  requireFile,
  freshEnv
} = require('@bldr/test-helper')

const { QuickStart } = requireFile('@bldr/core', 'quick-start.js')

const initiateQuickStart = function () {
  return new QuickStart(freshEnv())
}

let quickStart

/***********************************************************************
 *
 **********************************************************************/

describe('Class “QuickStart()” #unittest', () => {
  beforeEach(() => {
    quickStart = initiateQuickStart()
  })

  describe('Properties', () => {
    it('Property “this.env.document”', () => {
      assert.equal(quickStart.env.document.nodeName, '#document')
    })

    it('Property “this.elemNavigationMenu”', () => {
      assert.equal(quickStart.elemNavigationMenu.nodeName, 'NAV')
    })
  })

  describe('Methods', () => {
    it('Method “collectEntries_()”', () => {
      const entries = quickStart.collectEntries_()
      assert.equal(entries[0].title, 'Audio')
      assert.equal(entries[0].masterName, 'audio')
      assert.equal(entries[0].cssID, 'quick-start-entry_audio_1')
      assert.equal(entries[0].data, true)

      assert.equal(entries[1].title, 'Camera')
      assert.equal(entries[1].masterName, 'camera')
      assert.equal(entries[1].cssID, 'quick-start-entry_camera_2')
      assert.equal(entries[1].data, true)
    })

    it('Method “renderButton_()”', () => {
      const entry = {
        title: 'lol',
        fontawesome: 'lol'
      }
      const button = quickStart.renderButton_(entry)
      assert.equal(button.nodeName, 'BUTTON')
      assert.equal(button.title, 'lol')
      assert.equal(button.classList.item(0), 'fa')
      assert.equal(button.classList.item(1), 'fa-lol')
    })

    it('Method “renderNavigationMenu_()”', () => {
      quickStart.renderNavigationMenu_()
      const buttons = quickStart.env.document.querySelectorAll('#nav-quick-start button')
      assert.equal(buttons[0].title, 'Audio (ctrl+alt+a)')
    })

    it('Method “set()”', () => {
      quickStart.set()
      const buttons = quickStart.env.document.querySelectorAll('#nav-quick-start button')
      assert.equal(buttons[0].title, 'Audio (ctrl+alt+a)')
    })
  })
})
