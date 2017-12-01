const {
  assert,
  masters,
  config,
  getDOM,
  fs,
  path,
  testFileMinimal,
  requireFile
} = require('baldr-test');

const {getSlides} = requireFile('app', 'slides.js');
const {SlidesSwitcher} = requireFile('app', 'slides-switcher.js');

let document = getDOM();
let slides = getSlides(config.slides, config, document, masters);
let slidesSwitcher = new SlidesSwitcher(slides, document, masters);

/***********************************************************************
 *
 **********************************************************************/

describe('Class “SlidesSwitcher()” #unittest', () => {

  describe('Properties', () => {

    it('Property “this.slides”', () => {
      assert.equal(slidesSwitcher.slides[1].no, 1);
    });

    it('Property “this.count”', () => {
      assert.equal(slidesSwitcher.count, 3);
    });

    it('Property “this.no”', () => {
      assert.equal(slidesSwitcher.no, 1);
    });

    it('Property “this.document”', () => {
      assert.equal(typeof slidesSwitcher.document, 'object');
    });

    it('Property “this.elemNavigationButtons.prev”', () => {
      assert.equal(
        slidesSwitcher.elemNavigationButtons.prev.id,
        'nav-slide-prev'
      );
    });

    it('Property “this.elemNavigationButtons.next”', () => {
      assert.equal(
        slidesSwitcher.elemNavigationButtons.next.id,
        'nav-slide-next'
      );
    });

  });

  describe('Methods', () => {

    it('Method “getByNo()”', () => {
      let slide = slidesSwitcher.getByNo(2);
      assert.equal(slide.no, 2);
    });

    it('Method “prev()”', () => {
      let slide = slidesSwitcher.prev();
      assert.equal(slide.no, 3);
    });

    it('Method “next()”', () => {
      let slide = slidesSwitcher.next();
      assert.equal(slide.no, 1);
    });

  });

});
