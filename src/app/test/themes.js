const {
  getDOM,
  allThemes,
  assert,
  path,
  requireFile
} = require('baldr-test');

const {getThemes} = requireFile('app', 'themes.js');
const themes = getThemes(getDOM());

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

    it('Method “getThemes()”', () => {
      assert.deepEqual(themes.getThemes(), allThemes);
    });

    it('Method “getPackageJSON()”', () => {
      assert.equal(
        themes.getPackageJSON('default').name,
        'baldr-theme-default'
      );
    });

    it('Method “resolveDependencies()”', () => {
      let cssFiles = themes.resolveDependencies(
        themes.getPackageJSON('default').dependencies
      );
      assert.equal(
        cssFiles[0],
        require.resolve('typeface-alegreya')
      );
    });

    it('Method “resolveTheme()”', () => {
      assert.equal(
        themes.resolveTheme('default'),
        path.dirname(
          require.resolve('baldr-theme-default')
        )
      );
    });

    it('Method “getAllCSSFiles()”', () => {
      let cssFiles = themes.getAllCSSFiles();
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

    it('Method “setTheme()”', () => {
      themes.setTheme('handwriting');
      assert.equal(themes.document.body.dataset.theme, 'handwriting');
    });

  });

});
