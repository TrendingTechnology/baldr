const {
  getDOM,
  allThemes,
  assert,
  path,
  requireFile
} = require('baldr-test');

const {getThemes} = requireFile('app', 'themes.js');
const themes = getThemes(getDOM());

/***********************************************************************
 *
 **********************************************************************/

describe('Class “Themes()” #unittest', () => {

  describe('Properties', () => {

    it('Property “this.path”', () => {
      assert.equal(
        themes.path,
        path.resolve(__dirname, '..', '..', '..', 'themes')
      );
    });

    it('Property “this.all”', () => {
      assert.deepEqual(themes.all, allThemes);
    });

  });

  describe('Methods', () => {

    it('Method “getThemes_()”', () => {
      assert.deepEqual(themes.getThemes_(), allThemes);
    });

    it('Method “getPackageJSON_()”', () => {
      assert.equal(
        themes.getPackageJSON_('default').name,
        'baldr-theme-default'
      );
    });

    it('Method “resolveDependencies_()”', () => {
      let cssFiles = themes.resolveDependencies_(
        themes.getPackageJSON_('default').dependencies
      );
      assert.equal(
        cssFiles[0],
        require.resolve('typeface-alegreya')
      );
    });

    it('Method “resolveTheme_()”', () => {
      assert.equal(
        themes.resolveTheme_('default'),
        path.dirname(
          require.resolve('baldr-theme-default')
        )
      );
    });

    it('Method “getAllCSSFiles_()”', () => {
      let cssFiles = themes.getAllCSSFiles_();
      assert.equal(
        cssFiles[0],
        require.resolve('typeface-alegreya')
      );
      assert.equal(
        cssFiles.pop(),
        require.resolve('baldr-theme-handwriting')
      );
    });

    it('Method “loadThemes()”', () => {
      assert.equal(
        themes.document.querySelectorAll('link.baldr-theme').length,
        7
      );
    });

  });

});
