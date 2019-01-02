const {
  getDOM,
  assert,
  requireFile
} = require('@bldr/test-helper')

const { getThemes } = requireFile('@bldr/core', 'themes.js')
const themes = getThemes(getDOM())

/***********************************************************************
 *
 **********************************************************************/

describe('Class “Themes()” #unittest', () => {
  describe('Properties', () => {
    it('Property “this.all”', () => {
      assert.deepEqual(themes.all, [
        '@bldr/theme-default',
        '@bldr/theme-handwriting'
      ])
    })
  })

  describe('Methods', () => {
    it('Method “getAllCSSFiles_()”', () => {
      let cssFiles = themes.getAllCSSFiles_()
      assert.strictEqual(cssFiles.length, 7)
    })

    it('Method “loadThemes()”', () => {
      assert.equal(
        themes.document.querySelectorAll('link.baldr-theme').length,
        7
      )
    })
  })
})
