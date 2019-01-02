/**
 * @file Gather informations about all available master slides
 * @module @bldr/core/masters
 */

'use strict'

const fs = require('fs')
const path = require('path')
const { addCSSFile } = require('@bldr/foundation-master')

/***********************************************************************
 *
 **********************************************************************/

/**
 * Data in various types to pass to a master slide.
 * @typedef rawMasterData
 * @type {(boolean|number|string|array|object)}
 */

/**
 * Normalized master data in various types.
 * @typedef masterData
 * @type {(boolean|number|string|array|object)}
 */

/***********************************************************************
 *
 **********************************************************************/

/**
 *
 */
class Master {
  /**
   * @param {string} packageName - The name of the node package which is a master.
   */
  constructor (packageName) {
    let defaults = this.setDefaults_(packageName)
    let dirname = path.dirname(require.resolve(packageName))

    /*******************************************************************
     * Members
     ******************************************************************/

    /**
     * @type {object}
     * @property {object} config
     * @property {boolean} config.centerVertically
     * @property {boolean} config.margin
     * @property {boolean} config.stepSupport
     * @property {string} config.theme
     */
    this.config = defaults.config

    /**
     * @type {boolean}
     */
    this.css = this.hasCSS_(dirname)

    /**
     * Some documentation informations about the master slide.
     *
     *
     *     exports.documentation = {
     *       examples: [
     *     `
     *     - mastername:
     *          property: value
     *     `,
     *     `
     *     - mastername:
     *          property: value
     *     `
     *       ]
     *     };
     *
     * @type {object}
     * @property {object} documentation
     * @property {array} documentation.examples
     */
    this.documentation = defaults.documentation

    /**
     * @type {string}
     */
    this.path = dirname

    /**
     * The name of the master
     * @type {string}
     */
    this.name = defaults.name

    /**
     * The name of the node package which contains the master.
     * @type {string}
     */
    this.packageName = packageName

    /*******************************************************************
     * Methods
     ******************************************************************/

    /**
     * @function
     * @param {module:@bldr/core~Document} document The document
     *   object (DOM) of the render process.
     * @param {module:@bldr/core/slides~Slide} oldSlide The
     *   object representation of the old slide.
     * @param {module:@bldr/core/slides~Slide} newSlide The
     *   object representation of the new slide.
     */
    this.cleanUp = defaults.cleanUp

    /**
     * @function
     * @param {module:@bldr/core~Document} document The document
     *   object (DOM) of the render process.
     * @param {module:@bldr/foundation-master/config~Config} config All
     *   configurations of the current presentation session.
     */
    this.init = defaults.init

    /**
     * @function
     * @param {module:@bldr/core~Document} document The document
     *   object (DOM) of the render process.
     * @param {module:@bldr/core/slides~Slide} slide The object
     *   representation of one slide.
     * @param {module:@bldr/foundation-master/config~Config} config All
     *   configurations of the current presentation session.
     *
     * @return {module:@bldr/core/slides~stepData}
     */
    this.initSteps = defaults.initSteps

    /**
     * @function
     * @param {module:@bldr/core~Document} document The document
     *   object (DOM) of the render process.
     * @param {module:@bldr/core/slides~Slide} slide The object
     *   representation of one slide.
     * @param {module:@bldr/foundation-master/config~Config} config All
     *   configurations of the current presentation session.
     *
     * @return {module:@bldr/core/slides~stepData}
     */
    this.initStepsEveryVisit = defaults.initStepsEveryVisit

    /**
     * @function
     * @param {module:@bldr/core/slides~Slide} slide The object
     *   representation of one slide.
     * @param {module:@bldr/foundation-master/config~Config} config All
     *   configurations of the current presentation session.
     * @param {module:@bldr/core~Document} document The document
     *   object (DOM) of the render process.
     *
     * @return {string}
     */
    this.mainHTML = defaults.mainHTML

    /**
     * @function
     * @return {string}
     */
    this.modalHTML = defaults.modalHTML

    /**
     * Normalize the data input of the master slide.
     *
     * @function
     * @param {module:@bldr/core/masters~rawMasterData} rawMasterData
     *   Data in various types to pass to a master slide.
     * @param {module:@bldr/foundation-master/config~Config} config All
     *   configurations of the current presentation session.
     *
     * @return {module:@bldr/core/masters~masterData} The
     * normalized master data.
     *
     * @see {@link module:@bldr/core/slides~Slide}
     */
    this.normalizeData = defaults.normalizeData

    /**
     * @function
     * @param {module:@bldr/core~Document} document The document
     * object (DOM) of the render process.
     * @param {module:@bldr/foundation-master/config~Config} config All
     *   configurations of the current presentation session.
     * @param {module:@bldr/core/slides~Slide} slide The object
     *   representation of one slide.
     *
     * @return {undefined}
     * @see {@link module:@bldr/core~ShowRunner#setMain}
     */
    this.postSet = defaults.postSet

    /**
     * @function
     * @return {module:@bldr/core/quick-start~rawQuickStartEntries}
     * @see {@link module:@bldr/core/quick-start~QuickStart#collectEntries}
     */
    this.quickStartEntries = defaults.quickStartEntries

    /**
     * @function
     * @param {integer} no
     * @param {integer} count
     * @param {object} stepData
     * @param {module:@bldr/core~Document} document The document
     *   object (DOM) of the render process.
     *
     * @return {undefined}
     * @see {@link module:@bldr/core/slides~StepSwitcher#setByNo}
     */
    this.setStepByNo = defaults.setStepByNo
  }

  /**
   * Check if the CSS style file “styles.css” in the master slide
   * folder exists.
   */
  hasCSS_ (masterPath) {
    if (fs.existsSync(path.join(masterPath, 'styles.css'))) {
      return true
    } else {
      return false
    }
  }

  /**
   *
   */
  setDefaults_ (packageName) {
    let requireObject = require(packageName)
    let emptyFunc = function () {}
    let returnEmpty = function () { return '' }
    let funcFalse = function () { return false }

    let config = {
      centerVertically: false,
      margin: true,
      stepSupport: false,
      theme: 'default'
    }

    let documentation = {
      examples: []
    }

    requireObject.config = Object.assign({}, config, requireObject.config)
    requireObject.documentation = Object.assign({}, documentation, requireObject.documentation)

    let defaultObject = {
      cleanUp: emptyFunc,
      init: emptyFunc,
      initSteps: funcFalse,
      initStepsEveryVisit: funcFalse,
      mainHTML: returnEmpty,
      modalHTML: returnEmpty,
      normalizeData: function (data) { return data },
      postSet: emptyFunc,
      quickStartEntries: function () { return [] },
      setStepByNo: emptyFunc
    }

    return Object.assign({}, defaultObject, requireObject)
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
   * @param {module:@bldr/core~Document} document The document
   *   object (DOM) of the render process.
   */
  constructor (document) {
    /**
     * The document object (DOM) of the render process.
     * @type {module:@bldr/core~Document}
     */
    this.document = document

    /**
     * Parent path of all master slide modules.
     * @type {string}
     */
    this.path = path.join(__dirname, '..', '..', 'masters')


    let all = [
      '@bldr/master-audio',
      '@bldr/master-camera',
      '@bldr/master-editor',
      '@bldr/master-image',
      '@bldr/master-markdown',
      '@bldr/master-person',
      '@bldr/master-question',
      '@bldr/master-quote',
      '@bldr/master-svg',
      '@bldr/master-video',
      '@bldr/master-website'
    ]

    /**
     * All node packages which contain masters.
     * @type {array}
     */
    this.all = []

    for (let packageName of all) {
      let master = this.initMaster_(packageName)
      this.all.push(master.name)
      this[master.name] = master
    }

    this.addCSS_()
  }

  /**
   * @param {string} packageName - The name of the node package which contains
   *   the master slide.
   */
  initMaster_ (packageName) {
    return new Master(packageName)
  }

  /**
   *
   */
  addCSS_ () {
    for (let masterName of this.all) {
      if (this[masterName].css) {
        addCSSFile(
          this.document,
          path.join(this[masterName].path, 'styles.css'),
          'baldr-master'
        )
      }
    }
  }

  /**
   *
   */
  execAll (hookName) {
    let args = Array.from(arguments)
    args.shift()
    for (let master of this.all) {
      this[master][hookName](...args)
    }
  }
}

/**
 * @param {module:@bldr/core~Document} document The document
 *   object (DOM) of the render process.
 */
exports.getMasters = function (document) {
  return new Masters(document)
}
