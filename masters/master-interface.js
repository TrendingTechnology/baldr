/**
 * @module baldr-master_INTERFACE
 */

/***********************************************************************
 * Members
 **********************************************************************/

/**
 * @property {object} config
 * @property {boolean} config.centerVertically
 * @property {boolean} config.stepSupport
 * @property {string} config.theme
 */
exports.config = {

};

/**
 * @property {object} documentation
 * @property {array} documentation.examples
 */
exports.documentation = {
  examples: [
`
- mastername:
     property: value
`,
`
- mastername:
     property: value
`
  ]
};

/***********************************************************************
 * Methods
 **********************************************************************/

/**
 * @param {object} document
 * @param {slide} oldSlide
 * @param {slide} newSlide
 */
exports.cleanUp = function(document, oldSlide, newSlide) {};

/**
 * @param {object} document
 * @param {module:baldr-library/config~Config} config
 */
exports.init = function(document, config) {};

/**
 * @param {object} document
 * @param {object} slide
 * @param {module:baldr-library/config~Config} config
 */
exports.initSteps = function(document, slide, config) {};

/**
 * @param {object} document
 * @param {object} slide
 * @param {object} config
 */
exports.initStepsEveryVisit = function(document, slide, config) {};


/**
 * @param {module:baldr-master_INTERFACE~slide} slide
 * @param {object} config
 * @param {object} document
 */
exports.mainHTML = function(slide, config, document) {};

/**
 *
 */
exports.modalHTML = function() {};

/**
 * @param {object} rawSlideData
 * @param {module:baldr-library/config~Config} config
 */
exports.normalizeData = function(rawSlideData, config) {};

/**
 * @param {object} document
 * @param {module:baldr-library/config~Config} config
 * @param {object} slide
 */
exports.postSet = function(slide, config, document) {};

/**
 * @return {module:baldr-master_INTERFACE~rawQuickStartEntries}
 */
exports.quickStartEntries = function() {};

/**
 * @param {integer} no
 * @param {integer} count
 * @param {object} stepData
 * @param {object} document
 */
exports.setStepByNo = function(no, count, stepData, document) {};

/***********************************************************************
 * typedef
 **********************************************************************/

/**
 * @typedef slide
 * @type {object}
 * @property {integer} no
 * @property {string} master
 * @property {string|array|object} rawData
 * @property {string|array|object} normalizedData
 * @property {object} steps
 */

/**
 * @typedef rawQuickStartEntries
 * @type {array}
 */

/**
 * @typedef rawQuickStartEntry
 * @type {object}
 * @property {title} title
 * @property {string|array|object} data
 * @property {string} shortcut
 * @property {string} fontawesome
 */
