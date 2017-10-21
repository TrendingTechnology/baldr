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
  let out = {};

  yamlRaw.forEach((slide, index) => {
    let no = index + 1;
    let master = Object.keys(slide)[0];
    out[index + 1] = {
      "no": no,
      "master": master,
      "data": slide[master]
    };
  });

  return out;
};
