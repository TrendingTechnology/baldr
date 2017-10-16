/**
 * @file Index file of the render process.
 */

const yaml = require('js-yaml');
const fs = require('fs');

/**
 * Load the content of a yaml file and convert its content into a
 * object.
 * @param {string} yamlFile Path of the yaml file.
 * @return {object} Object representation of the yaml file.
 */
var loadYaml = function(yamlFile) {
  try {
    return yaml.safeLoad(fs.readFileSync(yamlFile, 'utf8'));
  } catch (e) {
    throw e;
  }
}

/**
 * presentation - description
 *
 * @param {string} yamlFile Path of the yaml file.
 */
presentation = function(yamlFile) {
  this.currentSlideNumber;
  this.currentSlideObject;
  this.slideNumber;
  this.slides;
};

/**
 * presentation.prototype.previousSlide - Display the previous slide.
 */
presentation.prototype.previousSlide = function() {

}

/**
 * presentation.prototype.nextSlide - Display the next slide.
 */
presentation.prototype.nextSlide = function() {

}

exports.loadYaml = loadYaml;
