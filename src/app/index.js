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
 * @param {string} fileName
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
 * The object of shortcut library “mousetrap”.
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
   * @param {array} argv An array containing the command line arguments.
   * @param {module:baldr-application~Document} document The document
   *   object (DOM) of the render process.
   * @param {module:baldr-application~mousetrap} mousetrap The object
   *   of shortcut library “mousetrap”.
   */
  constructor(argv, document, mousetrap) {

    /**
     * The document object (DOM) of the render process.
     * @type {module:baldr-application~Document}
     */
    this.document = document;

    /**
     * The object of shortcut library “mousetrap”.
     * @type {module:baldr-application~mousetrap}
     */
    this.mousetrap = mousetrap;

    /**
     * All configurations of the current presentation session.
     * @type {module:baldr-library/config~Config}
     */
    this.config = getConfig(argv);

    /**
     * All available master slides.
     * @type {module:baldr-application/masters~Masters}
     */
    this.masters = getMasters();
    this.masters.execAll('init', document, this.config);

    /**
     * All slide objects of the current presentation session.
     * @type {module:baldr-application/slides~Slides}
     */
    this.slides = getSlides(
      this.config.slides,
      this.config,
      document,
      this.masters
    );

    /**
     * All available themes.
     * @type {module:baldr-application/themes~Themes}
     */
    this.themes = getThemes(document);

    /**
     * Object to switch between the slides.
     * @type {module:baldr-application/slides-switcher~SlidesSwitcher}
     */
    this.slidesSwitcher = new SlidesSwitcher(
      this.slides,
      this.document,
      this.masters
    );

    /**
     * The object representation of the old slide.
     * @type {module:baldr-application/slides~Slide}
     */
    this.oldSlide = {};

    /**
     * The object representation of the new slide.
     * @type {module:baldr-application/slides~Slide}
     */
    this.newSlide = {};

    /**
     * Object to manage the quick start entries.
     * @type {module:baldr-application/quick-start~QuickStart}
     */
    this.quickStart = getQuickStart(document, this.masters, this.config);
    this.quickStart.set();
    this.quickStart.bind(this, this.mousetrap);

    this.setFirstSlide_();

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
  setFirstSlide_() {
    this.newSlide = this.slidesSwitcher.getByNo(1);
    this.newSlide.set();
  }

  /**
   *
   */
  setInstantSlide(masterName, rawData) {
    this.oldSlide = this.newSlide;
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

exports.ShowRunner = ShowRunner;
