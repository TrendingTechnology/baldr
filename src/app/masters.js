/**
 * @file Gather informations about all available master slides
 * @module baldr-application/masters
 */

'use strict';

const fs = require('fs');
const path = require('path');

/***********************************************************************
 *
 **********************************************************************/

/**
 *
 */
class Master {

  /**
   * @param {string} modulePath
   * @param {string} name
   */
  constructor(modulePath, name) {
    let defaults = this.setDefaults_(modulePath);
    let dirname = path.dirname(modulePath);

    /*******************************************************************
     * Members
     ******************************************************************/

    /**
     * @type {object}
     * @property {object} config
     * @property {boolean} config.centerVertically
     * @property {boolean} config.stepSupport
     * @property {string} config.theme
     */
    this.config = defaults.config;

    /**
     * @type {boolean}
     */
    this.css = this.hasCSS_(dirname);

    /**
     * Some documentation informations about the master slide.
     *
     * <code><pre>
     * exports.documentation = {
     *   examples: [
     * `
     * - mastername:
     *      property: value
     * `,
     * `
     * - mastername:
     *      property: value
     * `
     *   ]
     * };
     * </pre></pre>
     * @type {object}
     * @property {object} documentation
     * @property {array} documentation.examples
     */
    this.documentation = defaults.documentation;

    /**
     * @type {string}
     */
    this.path = dirname;

    /**
     * @type {string}
     */
    this.name = name;

    /*******************************************************************
     * Methods
     ******************************************************************/

    /**
     * @function
     * @param {object} document
     * @param {module:baldr-application/slides~Slide} oldSlide
     * @param {module:baldr-application/slides~Slide} newSlide
     */
    this.cleanUp = defaults.cleanUp;

    /**
     * @function
     * @param {object} document
     * @param {module:baldr-library/config~Config} config
     */
    this.init = defaults.init;

    /**
     * @function
     * @param {object} document
     * @param {module:baldr-application/slides~Slide} slide
     * @param {module:baldr-library/config~Config} config
     */
    this.initSteps = defaults.initSteps;

    /**
     * @function
     * @param {object} document
     * @param {module:baldr-application/slides~Slide} slide
     * @param {module:baldr-library/config~Config} config
     */
    this.initStepsEveryVisit = defaults.initStepsEveryVisit;

    /**
     * @function
     * @param {module:baldr-application/slides~Slide} slide
     * @param {module:baldr-library/config~Config} config
     * @param {object} document
     * @return {string}
     */
    this.mainHTML = defaults.mainHTML;

    /**
     * @function
     * @return {string}
     */
    this.modalHTML = defaults.modalHTML;

    /**
     * @function
     * @param {object} rawSlideData
     * @param {module:baldr-library/config~Config} config
     */
    this.normalizeData = defaults.normalizeData;

    /**
     * @function
     * @param {object} document
     * @param {module:baldr-library/config~Config} config
     * @param {module:baldr-application/slides~Slide} slide
     * @return {undefined}
     * @see {@link module:baldr-application~ShowRunner#setMain}
     */
    this.postSet = defaults.postSet;

    /**
     * @function
     * @return {module:baldr-application/quick-start~rawQuickStartEntries}
     * @see {@link module:baldr-application/quick-start~QuickStart#collectEntries}
     */
    this.quickStartEntries = defaults.quickStartEntries;

    /**
     * @function
     * @param {integer} no
     * @param {integer} count
     * @param {object} stepData
     * @param {object} document
     * @return {undefined}
     * @see {@link module:baldr-application/slides~StepSwitcher#setByNo}
     */
    this.setStepByNo = defaults.setStepByNo;
  }

  /**
   * Check if the CSS style file “styles.css” in the master slide
   * folder exists.
   *
   * @private
   */
  hasCSS_(masterPath) {
    if (fs.existsSync(path.join(masterPath, 'styles.css'))) {
      return true;
    }
    else {
      return false;
    }
  }

  /**
   * @private
   */
  setDefaults_(modulePath) {
    let requireObject = require(modulePath);
    let emptyFunc = function() {};
    let returnEmpty = function() {return '';};
    let funcFalse = function() {return false;};

    let config = {
      centerVertically: false,
      stepSupport: false,
      theme: 'default'
    };

    let documentation = {
      examples: []
    };

    requireObject.config = Object.assign({}, config, requireObject.config);
    requireObject.documentation = Object.assign({}, documentation, requireObject.documentation);

    let defaultObject = {
      cleanUp: emptyFunc,
      init: emptyFunc,
      initSteps: funcFalse,
      initStepsEveryVisit: funcFalse,
      mainHTML: returnEmpty,
      modalHTML: returnEmpty,
      normalizeData: function(data) {return data;},
      postSet: emptyFunc,
      quickStartEntries: function() {return [];},
      setStepByNo: emptyFunc
    };

    return Object.assign({}, defaultObject, requireObject);
  }

}

/***********************************************************************
 *
 **********************************************************************/

/**
 * Gather informations about all available master slides.
 */
class Masters {

  /**
   *
   */
  constructor() {

    /**
     * Parent path of all master slide modules.
     * @type {string}
     */
    this.path = path.join(__dirname, '..', '..', 'masters');

    /**
     * Folder name of master slides
     * @type {array}
     */
    this.all = this.getAll();
    for (let master of this.all) {
      let masterPath = path.join(this.path, master);
      this[master] = new Master(path.join(masterPath, 'index.js'), master);
    }

  }

  /**
   *
   */
  execAll(hookName) {
    let args = Array.from(arguments);
    args.shift();
    for (let master of this.all) {
      this[master][hookName](...args);
    }
  }

  /**
   *
   */
  getHooks(hookName, type='function') {
    return this.all.filter(
      master => typeof this[master][hookName] === type
    );
  }

  /**
   * Get the folder off all master slide modules.
   * @return {array} Folder name of master slides
   */
  getAll() {
    return fs.readdirSync(this.path, 'utf8')
    .filter(
      dir => fs.statSync(
        path.join(this.path, dir)
      ).isDirectory()
    );
  }
}

/**
 *
 */
exports.getMasters = function() {
  return new Masters();
};
