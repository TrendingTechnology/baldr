/**
 * @file Load the yaml file and process it.
 */

const fs = require('fs');
const yaml = require('js-yaml');

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
};

/**
 * @param {array} yamlRaw The yaml file converted in an array of objects.
 * @return {object} Processed object
 */
var processYaml = function(yamlRaw) {

  // this.slides = loadYaml(yamlFile);
  // this.count = this.slides.length;
  // this.current = {};
  // this.current.no = 1;
  //
  // let index = this.current.no - 1;
  // let currentObject = this.slides[index];
  // this.current.master = Object.keys(currentObject)[0];
  // this.current.data = currentObject[this.current.master];

};
