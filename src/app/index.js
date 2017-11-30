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
const {
  getInstantSlide,
  getSlides,
  Slide
} = requireLib('slides');
const {SlidesSwitcher} = requireLib('slides-switcher');
const {getThemes} = requireLib('themes');

/***********************************************************************
 *
 **********************************************************************/

/**
 * The document object of the browser (DOM), see on MDN:
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/Document Document}
 * @typedef Document
 * @type {object}
 */

/**
 * The mousetrap object
 * {@link https://www.npmjs.com/package/mousetrap}
 * @typedef mousetrap
 * @type {object}
 */

/***********************************************************************
 *
 **********************************************************************/

/**
 *
 */
class ShowRunner {

  /**
   * @param {module:baldr-application~Document} document
   */
  constructor(argv, document, mousetrap) {

    /**
     * @type {module:baldr-application~Document}
     */
    this.document = document;

    /**
     * @type {module:baldr-application~mousetrap}
     */
    this.mousetrap = mousetrap;

    /**
     * @type {module:baldr-library/config~Config}
     */
    this.config = getConfig(argv);

    /**
     * @type {module:baldr-application/masters~Masters}
     */
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

    /**
     * @type {module:baldr-application/slides~Slide}
     */
    this.oldSlide = {};

    /**
     * @type {module:baldr-application/slides~Slide}
     */
    this.newSlide = {};

    /**
     * @type {module:baldr-application/quick-start~QuickStart}
     */
    this.quickStart = getQuickStart(document, this.masters, this.config);
    this.quickStart.set();
    this.quickStart.bind(this, this.mousetrap);

    this.setFirstSlide();

    this.addMastersCSS_();
  }

  /**
   *
   */
  addMastersCSS_() {
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
  setFirstSlide() {
    this.newSlide = this.slidesSwitcher.getByNo(1);
    this.newSlide.set();
  }

  /**
   *
   */
  setInstantSlide(masterName, rawData) {
    this.newSlide = getInstantSlide(
      masterName,
      rawData,
      this.document,
      this.config,
      this.masters
    );
    this.newSlide.set(this.oldSlide);
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
    this.newSlide.set(this.oldSlide);
  }

  /**
   *
   */
  slideNext() {
    this.oldSlide = this.newSlide;
    this.newSlide = this.slidesSwitcher.next();
    this.newSlide.set(this.oldSlide);
  }

}

// TODO: Remove
exports.getMasters = getMasters;
exports.getSlides = getSlides;
exports.SlidesSwitcher = SlidesSwitcher;
exports.getThemes = getThemes;

exports.ShowRunner = ShowRunner;
