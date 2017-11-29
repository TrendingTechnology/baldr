/**
 * @module baldr-application
 */

'use strict';

const path = require('path');

const {
  addCSSFile,
  getConfig
} = require('baldr-library');

/**
 *
 */
let requireLib = function(fileName) {
  return require(path.join(__dirname, fileName + '.js'));
};

const {getQuickStart} = requireLib('quick-start');
const {getMasters} = requireLib('masters');
const {getSlides, Slide} = requireLib('slides');
const {SlidesSwitcher} = requireLib('slides-switcher');
const {getThemes} = requireLib('themes');

/**
 *
 */
class ShowRunner {

  /**
   * @param {object} document The document object of the browser (DOM), see on MDN:
   * {@link https://developer.mozilla.org/en-US/docs/Web/API/Document Document}
   */
  constructor(argv, document, mousetrap) {
    this.document = document;
    this.mousetrap = mousetrap;

    /**
     * @type {module:baldr-library/config~Config}
     */
    this.config = getConfig(argv);
    this.masters = getMasters();
    this.masters.execAll('init', document, this.config);

    /**
     * @type {module:baldr-application/slides~Slides}
     */
    this.slides = getSlides(
      this.config.slides,
      this.config,
      document,
      this.masters
    );

    /**
     * @type {module:baldr-application/themes~Themes}
     */
    this.themes = getThemes(document);

    /**
     * @type {module:baldr-application/slides-switcher~SlidesSwitcher}
     */
    this.slidesSwitcher = new SlidesSwitcher(
      this.slides,
      this.document,
      this.masters
    );

    this.oldSlide = {};
    this.addMastersCSS();
    this.quickStart = getQuickStart(document, this.masters);
    this.quickStart.set();
    this.setFirstSlide();
    this.quickStart.bind(this, this.mousetrap);
  }

  /**
   *
   */
  addMastersCSS() {
    for (let master of this.masters.all) {
      if (this.masters[master].css) {
        addCSSFile(
          this.document,
          path.join(this.masters[master].path, 'styles.css'),
          'baldr-master'
        );
      }
    }
  }

  /**
   *
   */
  setMain(slide) {
    let master = this.masters[this.newSlide.master];
    let elements = {
      slide: this.document.getElementById('slide-content'),
      modal: this.document.getElementById('modal-content')
    };

    let dataset = this.document.body.dataset;
    dataset.master = slide.master;
    dataset.centerVertically = master.config.centerVertically;
    dataset.theme = master.config.theme;

    elements.slide.innerHTML = master.mainHTML(
      slide,
      this.config,
      this.document
    );
    elements.modal.innerHTML = master.modalHTML();

    master.postSet(slide, this.config, this.document);
  }

  /**
   *
   */
  setSlide(slide) {
    if (this.oldSlide.hasOwnProperty('master')) {
      this.masters[this.oldSlide.master]
      .cleanUp(this.document, this.oldSlide, slide);
    }
    this.newSlide = slide;
    this.setMain(slide);
    this.newSlide.steps.visit();
  }

  /**
   * Show a master slide without custom data.
   *
   * The displayed master slide is not part of the acutal presentation.
   * Not every master slide can be shown with this function. It muss be
   * possible to render the master slide without custom data.
   * No number is assigned to the master slide.
   * @param {string} name Name of the master slide
   */
  setInstantSlide(masterName, rawData=true) {
    let rawSlide = {};
    rawSlide[masterName] = rawData;
    let slide = new Slide(rawSlide, this.document, this.config, this.masters);
    this.setSlide(slide);
  }

  /**
   *
   */
  setFirstSlide() {
    this.newSlide = this.slidesSwitcher.getByNo(1);
    this.setSlide(this.newSlide);
  }

  /**
   *
   */
  stepPrev() {
    this.newSlide.steps.prev();
  }

  /**
   *
   */
  stepNext() {
    this.newSlide.steps.next();
  }

  /**
   *
   */
  slidePrev() {
    this.oldSlide = this.newSlide;
    this.newSlide = this.slidesSwitcher.prev();
    this.setSlide(this.newSlide);
  }

  /**
   *
   */
  slideNext() {
    this.oldSlide = this.newSlide;
    this.newSlide = this.slidesSwitcher.next();
    this.setSlide(this.newSlide);
  }

}

// TODO: Remove
exports.getMasters = getMasters;
exports.getSlides = getSlides;
exports.SlidesSwitcher = SlidesSwitcher;
exports.getThemes = getThemes;

exports.ShowRunner = ShowRunner;
