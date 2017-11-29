/**
 * @file Gather informations about all available master slides
 * @module baldr-application/masters
 */

'use strict';

const fs = require('fs');
const path = require('path');

/**
 *
 */
class Master {

  /**
   * @param {string} modulePath
   * @param {string} name
   */
  constructor(modulePath, name) {

    /**
     *
     */
    this.path = path.dirname(modulePath);

    /**
     *
     */
    this.name = name;

    /**
     *
     */
    this.css = this.hasCSS_(this.path);

    let defaults = this.setDefaults_(modulePath);

    /**
     * @function
     */
    this.cleanUp = defaults.cleanUp;

    /**
     * @function
     */
    this.init = defaults.init;

    /**
     * @function
     */
    this.initSteps = defaults.initSteps;

    /**
     * @function
     */
    this.initStepsEveryVisit = defaults.initStepsEveryVisit;

    /**
     * @function
     */
    this.mainHTML = defaults.mainHTML;

    /**
     * @function
     */
    this.modalHTML = defaults.modalHTML;

    /**
     * @function
     */
    this.normalizeData = defaults.normalizeData;

    /**
     * @function
     */
    this.postSet = defaults.postSet;

    /**
     * @function
     */
    this.quickStartEntries = defaults.quickStartEntries;

    /**
     * @function
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

    requireObject.config = Object.assign({}, config, requireObject.config);

    let defaultObject = {
      init: emptyFunc,
      normalizeData: function(data) {return data;},
      modalHTML: returnEmpty,
      mainHTML: returnEmpty,
      postSet: emptyFunc,
      setStepByNo: emptyFunc,
      initSteps: funcFalse,
      initStepsEveryVisit: funcFalse,
      cleanUp: emptyFunc,
      quickStartEntries: function() {return [];}
    };

    return Object.assign({}, defaultObject, requireObject);
  }

}

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
      this[master] = new Master(path.join(masterPath, 'index.js'));
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
