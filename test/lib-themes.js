const {
  document,
  allThemes,
  assert,
  path
} = require('baldr-test');


const {Themes} = require('../lib/themes.js');
const themes = new Themes(document);

describe('Class “Themes()”', () => {

  describe('Properties', () => {

    it('this.path', () => {
      assert.equal(
        themes.path,
        path.resolve(__dirname, '..', 'themes')
      );
    });

    it('this.all', () => {
      assert.deepEqual(themes.all, allThemes);
    });

  });

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
    themes.loadThemes();
    assert.equal(
      themes.document.querySelectorAll('link.baldr-theme').length,
      7
    );
  });

});
