/**
 * @file Load the slides object form the YAML file format and process it.
 * @module baldr-application/slides
 */

'use strict';

const fs = require('fs');
const path = require('path');

/***********************************************************************
 *
 **********************************************************************/

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

/***********************************************************************
 *
 **********************************************************************/

/**
 * Some masters support steps. Steps are switched by the up and down
 * arrow keys. Steps are the second level in the hierachy of state
 * changes. On the first level are slides.
 */
class StepSwitcher {

  /**
   * @param {module:baldr-application~Document} document The document
   *   object (DOM) of the render process.
   * @param {module:baldr-application/slides~Slide} slide The object
   *   representation of one slide.
   * @param {module:baldr-library/config~Config} config All
   *   configurations of the current presentation session.
   */
  constructor(document, slide, config) {

    /**
     * All configurations of the current presentation session.
     * @type {module:baldr-library/config~Config}
     */
    this.config = config;

    /**
     * The document object (DOM) of the render process.
     * @type {module:baldr-application~Document}
     */
    this.document = document;

    /**
     * The object representation of one slide.
     * @type {module:baldr-application/slides~Slide}
     */
    this.slide = slide;

    /**
     * The normalized master object derived from the master slide.
     * @type {module:baldr-application/masters~Master}
     */
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
     * @type {boolean}
     */
    this.stepSupport = false;

    /**
     * The current step number. (Default: 0)
     * @type {integer}
     */
    this.no = 0;

    /**
     * Indicates if a slide was already visited.
     * @type {boolean}
     */
    this.visited = false;
  }

  /**
   *
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
   * @param {module:baldr-application/slides~rawSlideObject} rawSlideObject
   *   A raw slide object containing only one property: The name of the
   *   master slide.
   * @param {module:baldr-application~Document} document The document
   *   object (DOM) of the render process.
   * @param {module:baldr-library/config~Config} config All
   *   configurations of the current presentation session.
   * @param {module:baldr-application/masters~Masters} masters All
   *   available master slides.
   */
  constructor(rawSlideObject, document, config, masters) {
    let intersection = this.intersectMastersSlideKeys_(
      masters.all,
      Object.keys(rawSlideObject)
    );

    if (intersection.length > 1) {
      throw Error('Each slide must have only one master slide.');
    }

    /**
     * All configurations of the current presentation session.
     * @type {module:baldr-library/config~Config}
     */
    this.config = config;

    /**
     * The document object (DOM) of the render process.
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
     * The normalized master object derived from the master slide.
     * @type {module:baldr-application/masters~Master}
     */
    this.master = masters[intersection[0]];

    /**
     * All configurations of the current presentation session.
     * @type {module:baldr-library/config~Config}
     */
    this.masters = masters;

    /**
     * Various types of data to render a slide.
     * @type {module:baldr-application/slides~rawSlideData}
     */
    this.rawData = rawSlideObject[this.master.name];

    /**
     * The normalized slide data
     * @type {(boolean|number|string|array|object)}
     */
    this.normalizedData = this.master
      .normalizeData(this.rawData, config);

    /**
     * The instantiated object derived from the class “StepSwitcher()”
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
 *
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
   * @param {array} rawSlides An array of raw slide objects.
   * @param {module:baldr-library/config~Config} config All
   *   configurations of the current presentation session.
   * @param {module:baldr-application~Document} document The document
   *   object (DOM) of the render process.
   * @param {module:baldr-application/masters~Masters} masters All
   *   available master slides.
   */
  constructor(rawSlides, config, document, masters) {

    /**
     * An array of raw slide objects.
     * @type {array}
     */
    this.rawSlides = rawSlides;

    /**
     * All configurations of the current presentation session.`
     * @type {module:baldr-library/config~Config}
     */
    this.config = config;

    /**
     * The document object (DOM) of the render process.
     * @type {module:baldr-application~Document}
     */
    this.document = document;

    /**
     * All available master slides.
     * @type {module:baldr-application/masters~Masters}
     */
    this.masters = masters;
  }

  /**
   * <pre><code>
   * {
   *   "1": {
   *     "no": 1,
   *     "master": "quote",
   *     "data": {
   *       "text": "Der Tag der Gunst ist wie der Tag der Ernte,\nman muss geschäftig sein sobald sie reift.\n",
   *       "author": "Johann Wolfgang von Goethe",
   *       "date": 1801
   *     }
   *   },
   *   "2": {
   *     "no": 2,
   *     "master": "question",
   *     "data": [
   *       {
   *         "question": "Wann starb Ludwig van Beethoven?",
   *         "answer": 1827
   *       }
   *     ]
   *   },
   *   "3": {
   *     "no": 3,
   *     "master": "person",
   *     "data": {
   *       "name": "Ludwig van Beethoven",
   *       "image": "beethoven.jpg"
   *     }
   *   }
   * }
   * </code><pre>
   * @return {object}
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
 * @param {array} rawSlides An array of raw slide objects.
 * @param {module:baldr-library/config~Config} config All
 *   configurations of the current presentation session.
 * @param {module:baldr-application~Document} document The document
 *   object (DOM) of the render process.
 * @param {module:baldr-application/masters~Masters} masters All
 *   available master slides.
 */
exports.getSlides = function(rawSlides, config, document, masters) {
  return new Slides(rawSlides, config, document, masters).get();
};

exports.Slide = Slide;
