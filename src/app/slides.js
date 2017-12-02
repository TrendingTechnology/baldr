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
 * A raw slide object or a raw slide string.
 *
 * If a string is obtained, it should be the name of a master slide.
 * This type is the direct input of the markdown configuration file
 * converted to a Javascript types.
 *
 * # Object with one property:
 *
 *     - markdown: Some text
 *
 * # Object with multiple properties:
 *
 *     - title: A quote
 *       quote:
 *         author: Goehte
 *         text: lol
 *
 * # String:
 *
 *     - camera
 *
 * @typedef rawSlideObject
 * @type {(object|string)}
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
   * @param {module:baldr-application/slides~Slide} slide The object
   *   representation of one slide.
   * @param {module:baldr-application~Environment} env Low level
   *   environment data.
   */
  constructor(slide, env) {

    /**
     * The object representation of one slide.
     * @type {module:baldr-application/slides~Slide}
     */
    this.slide = slide;

    /**
     * Low level environment data.
     * @type {module:baldr-application~Environment}
     */
    this.env = env;

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
      prev: this.env.document.getElementById('nav-step-prev'),
      next: this.env.document.getElementById('nav-step-next')
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
      this.master.initStepsEveryVisit(this.env.document, this.slide, this.env.config)
    );
    if (!this.visited) {
      this.setup_(
        this.master.initSteps(this.env.document, this.slide, this.env.config)
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
    this.master.setStepByNo(no, this.count, this.stepData, this.env.document);
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

class SlideInput {

  constructor(rawSlideData, masterNames, themeNames) {

    this.rawSlideData = Object.assign({}, rawSlideData);

    this.theme = false;
    this.masterName = false;
    this.rawMasterData = false;

    // string
    if (typeof rawSlideData === 'string') {
      let {masterName, rawMasterData} = this.pullMasterfromString_(rawSlideData, masterNames);
      rawSlideData = {};
      this.masterName = masterName;
      this.rawMasterData = rawMasterData;
    }
    // object
    else if (typeof rawSlideData === 'object' && !Array.isArray(rawSlideData)) {
      let {masterName, rawMasterData} = this.pullMasterfromObject_(rawSlideData, masterNames);
      this.masterName = masterName;
      this.rawMasterData = rawMasterData;
      this.theme = this.pullTheme_(rawSlideData, themeNames);
    // something else
    } else {
      throw Error(`Unsupported input type “${this.getType_(rawSlideData)}” on input data: ${this.toString_(rawSlideData)}`);
    }

    if (Object.keys(rawSlideData).length > 0) {
      throw Error(`Unknown slide properties: ${this.toString_(rawSlideData)}`);
    }

  }

  pullProperty_(rawSlideData, property) {
    if (rawSlideData.hasOwnProperty(property)) {
      const out = rawSlideData[property];
      delete rawSlideData[property];
      return out;
    }
    else {
      return false;
    }
  }

  intersect_(array1, array2) {
    return array1.filter((n) => array2.includes(n));
  }

  pullMasterfromString_(rawSlideData, masters) {
    if (masters.includes(rawSlideData)) {
      return {
        masterName: rawSlideData,
        rawMasterData: true
      };
    }
    else {
      throw Error(`Unknown master “${rawSlideData}” specified as string`);
    }
  }

  pullMasterfromObject_(rawSlideData, masterNames) {
    let intersection = this.intersect_(
      masterNames,
      Object.keys(rawSlideData)
    );

    if (intersection.length === 0) {
      throw Error(`No master slide found: ${this.toString_(rawSlideData)}`);
    }

    if (intersection.length > 1) {
      throw Error(`Each slide must have only one master slide: ${this.toString_(rawSlideData)}`);
    }
    let masterName = intersection[0];
    let rawMasterData = rawSlideData[masterName];
    this.pullProperty_(rawSlideData, masterName);

    return {
      masterName: masterName,
      rawMasterData: rawMasterData
    };
  }

  pullTheme_(rawSlideData, themeNames) {
    if (!rawSlideData.hasOwnProperty('theme')) {
      return false;
    }
    else if (themeNames.includes(rawSlideData.theme)) {
      let theme = rawSlideData.theme;
      this.pullProperty_(rawSlideData, 'theme');
      return theme;
    }
    else {
      throw Error(`Unkown theme: “${this.toString_(rawSlideData.theme)}”`);
    }
  }

  toString_(rawSlideData) {
    if (rawSlideData === null) {
      return 'null';
    }
    else if (!rawSlideData) {
      return typeof rawSlideData;
    }
    else if (typeof rawSlideData === 'string') {
      return rawSlideData;
    }
    else if (Array.isArray(rawSlideData)) {
      return rawSlideData.toString();
    }
    else {
      return JSON.stringify(rawSlideData);
    }
  }

  getType_(rawSlideData) {
    if (Array.isArray(rawSlideData)) {
      return 'array';
    }
    else if (rawSlideData === null) {
      return 'null';
    }
    else {
      return typeof rawSlideData;
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
   * @param {module:baldr-application~Environment} env Low level
   *   environment data.
   */
  constructor(rawSlideObject, env) {

    /**
     * Low level environment data.
     * @type {module:baldr-application~Environment}
     */
    this.env = env;

    const {masterName, rawSlideData} = this.findMaster_(
      rawSlideObject, this.env.masters
    );

    /**
     * @type {object}
     */
    this.elements = {
      slide: this.env.document.getElementById('slide-content'),
      modal: this.env.document.getElementById('modal-content')
    };

    /**
     * The normalized master object derived from the master slide.
     * @type {module:baldr-application/masters~Master}
     */
    this.master = this.env.masters[masterName];

    /**
     * Various types of data to render a slide.
     * @type {module:baldr-application/slides~rawSlideData}
     */
    this.rawData = rawSlideData;

    /**
     * The normalized slide data
     * @type {(boolean|number|string|array|object)}
     */
    this.normalizedData = this.master
      .normalizeData(this.rawData, this.env.config);

    /**
     * The instantiated object derived from the class “StepSwitcher()”
     * @type {module:baldr-application/slides~StepSwitcher}
     */
    this.steps = new StepSwitcher(this, this.env);

    /**
     * A HTML div element, which covers the complete slide area to
     * a void flickering, when new CSS styles are loaded.
     *
     * @type {object}
     */
    this.cover = this.env.document.getElementById('cover');
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
   * @param {module:baldr-application/slides~rawSlideObject} rawSlideObject
   *   A raw slide object containing only one property: The name of the
   *   master slide or a string.
   * @param {module:baldr-application/masters~Masters} masters All
   *   available master slides.
   */
  findMaster_(rawSlideObject, masters) {
    // string
    if (typeof rawSlideObject === 'string') {
      if (
        masters.hasOwnProperty(rawSlideObject) &&
        masters[rawSlideObject].name === rawSlideObject
      ) {
        return {
          masterName: rawSlideObject,
          rawSlideData: true
        };
      }
      else {
        throw Error(`Unknown master “${rawSlideObject}” specified as string`);
      }
    }
    // object
    else if (typeof rawSlideObject === 'object' && !Array.isArray(rawSlideObject)) {
      let intersection = this.intersectMastersSlideKeys_(
        masters.all,
        Object.keys(rawSlideObject)
      );

      if (intersection.length === 0) {
        throw Error(`No master slide found: ${JSON.stringify(rawSlideObject)}`);
      }

      if (intersection.length > 1) {
        throw Error(`Each slide must have only one master slide: ${JSON.stringify(rawSlideObject)}`);
      }
      return {
        masterName: intersection[0],
        rawSlideData: rawSlideObject[intersection[0]]
      };
    // something else
    } else {
      let type;
      if (Array.isArray(rawSlideObject)) {
        type = 'array';
      }
      else {
        type = typeof rawSlideObject;
      }
      let data;
      if (rawSlideObject) {
        data = rawSlideObject.toString();
      }
      else {
        data = typeof rawSlideObject;
      }
      throw Error(`Unsupported input type “${type}” on input data: ${data}`);
    }
  }

  /**
   * Set the background color of the “cover” DIV element.
   *
   * @param {string} color A CSS color information.
   * @param {number} zIndex A CSS color information.
   */
  setCover_(color, zIndex) {
    this.cover.style.backgroundColor = color;
    this.cover.style.zIndex = zIndex;
  }

  /**
   *
   */
  setDataset_() {
    let dataset = this.env.document.body.dataset;
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
      this.env.config,
      this.env.document
    );

  }

  /**
   *
   */
  set(oldSlide) {
    if (oldSlide && oldSlide.hasOwnProperty('master')) {
      this.env.masters[oldSlide.master.name]
      .cleanUp(this.env.document, oldSlide, this);
    }
    this.setCover_('black', 1);
    setTimeout(() => {
      this.setCover_('transparent', -1);
    }, 50);
    this.setDataset_();
    this.setMain_();
    this.setModal_();
    this.master.postSet(this, this.env.config, this.env.document);

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
 * @param {module:baldr-application~Environment} env Low level
 *   environment data.
 *
 * @return {module:baldr-application/slides~Slide}
 */
exports.getInstantSlide = function(masterName, rawSlideData, env) {
  let rawSlide = {};
  if (!rawSlideData) {
    rawSlideData = true;
  }
  rawSlide[masterName] = rawSlideData;
  return new Slide(rawSlide, env);
};

/***********************************************************************
 *
 **********************************************************************/

/**
 * Parse the object representation of all slides.
 */
class Slides {

  /**
   * @param {module:baldr-application~Environment} env Low level
   *   environment data.
   */
  constructor(env) {

    /**
     * Low level environment data.
     * @type {module:baldr-application~Environment}
     */
    this.env = env;

    /**
     * An array of raw slide objects.
     * @type {array}
     */
    this.rawSlides = this.env.config.slides;
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
      let slide = new Slide(rawSlide, this.env);
      slide.no = index + 1;
      out[index + 1] = slide;
    });

    return out;
  }

}

/**
 * @param {module:baldr-application~Environment} env Low level
 *   environment data.
 */
exports.getSlides = function(env) {
  return new Slides(env).get();
};

exports.Slide = Slide;
