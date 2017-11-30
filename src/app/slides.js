/**
 * @file Load the slides object form the YAML file format and process it.
 * @module baldr-application/slides
 */

'use strict';

const fs = require('fs');
const path = require('path');

/**
 * A raw slide object containing only one property: The name of the
 * master slide.
 * @typedef rawSlideObject
 * @type {object}
 * @property {rawSlideData} masterName
 */

/**
 * Various types of data to render a slide.
 * @typedef rawSlideData
 * @type {(boolean|number|string|array|object)}
 */

/**
 * Step data indexed by the step number begining with 1.
 *
 *     {
 *       1: {misc},
 *       2: {misc},
 *       3: {misc}
 *     }
 *
 * @typedef stepData
 * @type {object}
 * @property {stepData.1} stepDataEntry Misc step data
 * @property {stepData.2} stepDataEntry Misc step data
 * @property {stepData.3} stepDataEntry Misc step data
 */

/**
 * Some masters support steps. Steps are switched by the up and down
 * arrow keys. Steps are the second level in the hierachy of state
 * changes. On the first level are slides.
 */
class StepSwitcher {

  /**
   * @param {object} document The document object of the browser (DOM), see on MDN:
   * {@link https://developer.mozilla.org/en-US/docs/Web/API/Document Document}
   */
  constructor(document, slide, config) {
    this.config = config;
    this.document = document;
    this.slide = slide;

    this.master = slide.master;

    /**
     * The HTML-Button-Element that triggers the previous step.
     * @type {object}
     */
    this.elements = {
      prev: document.getElementById('nav-step-prev'),
      next: document.getElementById('nav-step-next')
    };

    /**
     * Object to store data for the individual steps. The step data
     * should be indexed by the step number.
     * @type {module:baldr-application/slides~stepData}
     */
    this.stepData = false;

    /**
     *
     */
    this.stepSupport = false;

    /**
     * The current step number. (Default: 0)
     * @type {integer}
     */
    this.no = 0;

    /**
     *
     */
    this.visited = false;
  }

  /**
   * @private
   */
  setButtonsVisibility_(state) {
    this.elements.prev.style.visibility = state;
    this.elements.next.style.visibility = state;
  }

  /**
   *
   */
  setup_(stepData) {
    if (stepData) {
      this.stepData = stepData;
      this.count = Object.keys(stepData).length;
      this.stepSupport = this.count > 1;
    }
  }

  /**
   *
   */
  visit() {
    this.setup_(
      this.master.initStepsEveryVisit(this.document, this.slide, this.config)
    );
    if (!this.visited) {
      this.setup_(
        this.master.initSteps(this.document, this.slide, this.config)
      );
      this.visited = true;
      this.no = 1;
    }

    if (this.stepSupport) {
      this.setByNo(this.no);
      this.setButtonsVisibility_('visible');
    }
    else {
      this.setButtonsVisibility_('hidden');
    }
  }

  /**
   *
   */
  setByNo(no) {
    this.master.setStepByNo(no, this.count, this.stepData, this.document);
  }

  /**
   *
   */
  prev() {
    if (this.stepSupport) {
      if (this.no === 1) {
        this.no = this.count;
      }
      else {
        this.no--;
      }
      this.setByNo(this.no);
    }
  }

  /**
   *
   */
  next() {
    if (this.stepSupport) {
      if (this.no === this.count) {
        this.no = 1;
      }
      else {
        this.no++;
      }
      this.setByNo(this.no);
    }
  }
}

/***********************************************************************
 *
 **********************************************************************/

/**
 *
 */
class Slide {

  /**
   * @param {object} document The document object of the browser (DOM), see on MDN:
   * {@link https://developer.mozilla.org/en-US/docs/Web/API/Document Document}
   */
  constructor(rawSlide, document, config, masters) {
    let intersection = this.intersectMastersSlideKeys_(
      masters.all,
      Object.keys(rawSlide)
    );

    if (intersection.length > 1) {
      throw Error('Each slide must have only one master slide.');
    }

    /**
     * @type {module:baldr-library/config~Config}
     */
    this.config = config;

    /**
     * @type {module:baldr-application~Document}
     */
    this.document = document;

    /**
     * @type {object}
     */
    this.elements = {
      slide: document.getElementById('slide-content'),
      modal: document.getElementById('modal-content')
    };

    /**
     * The master of the slide.
     * @type {module:baldr-application/masters~Master}
     */
    this.master = masters[intersection[0]];

    /**
     * @type {module:baldr-library/config~Config}
     */
    this.masters = masters;

    /**
     * The raw slide data
     * @type {(boolean|number|string|array|object)}
     */
    this.rawData = rawSlide[this.master.name];

    /**
     * The normalized slide data
     * @type {(boolean|number|string|array|object)}
     */
    this.normalizedData = this.master
      .normalizeData(this.rawData, config);

    /**
     * @type {module:baldr-application/slides~StepSwitcher}
     */
    this.steps = new StepSwitcher(document, this, config);
  }

  /**
   * Get the intersection between all master names and the slide keys.
   *
   * This method can be used to check that a slide object uses only
   * one master slide.
   *
   * @param {array} masterNames
   * @param {array} slideKeys
   * @return {array} The intersection as an array
   */
  intersectMastersSlideKeys_(masterNames, slideKeys) {
    return masterNames.filter((n) => slideKeys.includes(n));
  }

  /**
   *
   */
  setDataset_() {
    let dataset = this.document.body.dataset;
    dataset.master = this.master.name;
    dataset.centerVertically = this.master.config.centerVertically;
    dataset.theme = this.master.config.theme;
  }

  /**
   *
   */
  setModal_() {
    this.elements.modal.innerHTML = this.master.modalHTML();
  }

  /**
   *
   */
  setMain_() {
    this.elements.slide.innerHTML = this.master.mainHTML(
      this,
      this.config,
      this.document
    );

  }

  /**
   *
   */
  set(oldSlide) {
    if (oldSlide && oldSlide.hasOwnProperty('master')) {
      this.masters[oldSlide.master.name]
      .cleanUp(this.document, oldSlide, this);
    }
    this.setDataset_();
    this.setMain_();
    this.setModal_();
    this.master.postSet(this, this.config, this.document);

    this.steps.visit();
  }

}

/***********************************************************************
 *
 **********************************************************************/

/**
 * Show a master slide without custom data.
 *
 * The displayed master slide is not part of the acutal presentation.
 * Not every master slide can be shown with this function. It muss be
 * possible to render the master slide without custom data.
 * No number is assigned to the master slide.
 * @param {string} masterName Name of the master slide.
 * @param {module:baldr-application/slides~rawSlideData} rawSlideData
 *   Various types of data to render a slide.
 * @param {module:baldr-application~Document} document The document
 *   object (DOM) of the render process.
 * @param {module:baldr-library/config~Config} config All
 *   configurations of the current presentation session.
 * @param {module:baldr-application/masters~Masters} masters All
 *   available master slides.
 *
 * @return {module:baldr-application/slides~Slide}
 */
exports.getInstantSlide = function(masterName, rawSlideData, document, config, masters) {
  let rawSlide = {};
  if (!rawSlideData) {
    rawSlideData = true;
  }
  rawSlide[masterName] = rawSlideData;
  return new Slide(rawSlide, document, config, masters);
};

/***********************************************************************
 *
 **********************************************************************/

/**
 * Parse the object representation of all slides.
 */
class Slides {

  /**
   * @param {array} rawSlides A raw array of raw slide objects.
   * @param {module:baldr-library/config~Config} config
   * @param {object} document The document object of the browser (DOM), see on MDN:
   * {@link https://developer.mozilla.org/en-US/docs/Web/API/Document Document}
   */
  constructor(rawSlides, config, document, masters) {

    /**
     *
     */
    this.rawSlides = rawSlides;

    /**
     *
     */
    this.config = config;

    /**
     *
     */
    this.document = document;

    /**
     *
     */
    this.masters = masters;
  }

  /**
   *
   */
  get() {
    let out = {};

    this.rawSlides.forEach((rawSlide, index) => {
      let slide = new Slide(rawSlide, this.document, this.config, this.masters);
      slide.no = index + 1;
      out[index + 1] = slide;
    });

    return out;
  }

}

/**
 * @param {object} document The document object of the browser (DOM), see on MDN:
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/Document Document}
 */
exports.getSlides = function(rawSlides, config, document, masters) {
  return new Slides(rawSlides, config, document, masters).get();
};

exports.Slide = Slide;
