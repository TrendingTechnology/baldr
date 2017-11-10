const {
  allThemes,
  assert,
  path
} = require('baldr-test');


const {Themes} = require('../lib/themes.js');
const themes = new Themes();

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

});
