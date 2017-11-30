const {
  assert,
  masters,
  config,
  getDOM,
  fs,
  path,
  testFileMinimal
} = require('baldr-test');

const {SlidesSwitcher, getSlides} = require('baldr-application');
let document = getDOM();
let slides = getSlides(config.slides, config, document, masters);
let slidesSwitcher = new SlidesSwitcher(slides, document, masters);

/***********************************************************************
 *
 **********************************************************************/

describe('Class “SlidesSwitcher()” #unittest', () => {

  describe('Properties', () => {

    it('Property “this.cover”', () => {
      assert.equal(slidesSwitcher.cover.id, 'cover');
      assert.equal(slidesSwitcher.cover.nodeName, 'DIV');
    });

  });

  describe('Methods', () => {

    it('Method “setCover_()”', () => {
      slidesSwitcher.setCover_('red', 99);
      let cover = slidesSwitcher.document.getElementById('cover');
      assert.equal(cover.style.backgroundColor, 'red');
      assert.equal(cover.style.zIndex, 99);
    });

  });

});
