/**
 * @file Load the slides object form the YAML file format and process it.
 */

const fs = require('fs');
const yaml = require('js-yaml');
const path = require('path');

/**
 * @param {string} masterName The name of the master slide
 * @return {object} The module object of master slide
 */
var requireMaster = function(masterName) {
  return require(
    path.resolve('masters', masterName, 'index.js')
  );
};

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
 * @return {object} Processed object of slides
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

/**
 *
 * @param {string} yamlFile Path of the yaml file.
 */
var Presentation = function(yamlFile) {
  this.slides = processYaml(loadYaml(yamlFile));
  this.count = Object.keys(this.slides).length;
  this.no = 1;
  this.HTML = '';
};

/**
 * Set to the previous slide.
 */
Presentation.prototype.prev = function() {
  if (this.no === 1) {
    this.no = this.count;
  }
  else {
    this.no = this.no - 1;
  }
  return this;
};

/**
 * Set to the next slide.
 */
Presentation.prototype.next = function() {
  if (this.no === this.count) {
    this.no = 1;
  }
  else {
    this.no = this.no + 1;
  }
  return this;
};

Presentation.prototype.render = function() {
  let curSlide = this.slides[this.no];
  let master = requireMaster(curSlide.master);
  this.HTML = master.render(curSlide.data);
  return this;
};

Presentation.prototype.output = function() {
  return this.HTML;
};

exports.Presentation = Presentation;
