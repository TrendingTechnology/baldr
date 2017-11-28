
/**
 * @module baldr-master_INTERFACE
 */


/**
 * @typedef slide
 * @type {object}
 * @property {integer} no
 * @property {string} master
 * @property {string|array|object} rawData
 * @property {string|array|object} normalizedData
 * @property {object} steps
 */

// * `initSteps(document, slide, config)`
// * `initStepsEveryVisit(document, slide, config)`
// * `modalHTML()`
// * `normalizeData(rawSlideData, config)`
// * `postSet(slide, config, document)`
// * `setStepByNo(no, count, stepData, document)`

// * `documentation`: object
//   * `examples`: array



/**
 * @param {object} document
 * @param {slide} oldSlide
 * @param {slide} newSlide
 */
exports.cleanUp = function(document, oldSlide, newSlide) {};


/**
 * @property {object} config
 * @property {boolean} config.centerVertically
 * @property {boolean} config.stepSupport
 * @property {string} config.theme
 */
exports.config = {

}

/**
 * @param {object} document
 * @param {object} config
 */
exports.init = function(document, config) {};


/**
 * @param {slide} slide
 * @param {object} config
 * @param {object} document
 */
exports.mainHTML = function(slide, config, document) {};
