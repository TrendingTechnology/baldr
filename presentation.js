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
    let css = false;
    if (fs.existsSync(path.join('masters', master, 'styles.css'))) {
      css = true;
    }
    out[index + 1] = {
      "no": no,
      "master": master,
      "data": slide[master],
      "css": css
    };
  });

  return out;
};

/**
 * @param {string} yamlFile Path of the yaml file.
 * @constructor
 */
var Presentation = function(yamlFile) {

  /**
   * All slides index by the slide number.
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
   * @type {object}
   */
  this.slides = processYaml(loadYaml(yamlFile));

  /**
   * The count of all slides.
   * @type {int}
   */
  this.count = Object.keys(this.slides).length;

  /**
   * The current slide number.
   * @type {int}
   */
  this.no = 1;

  /**
   * The HTML code of the current slide.
   * @type {string}
   */
  this.HTML = '';
};

/**
 * Set the current slide to the previous slide.
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
 * Set the current slide to the next slide.
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

/**
 * Call the master slide and render the current slides’ HTML structure.
 */
Presentation.prototype.render = function() {
  let curSlide = this.slides[this.no];
  let master = requireMaster(curSlide.master);
  this.HTML = master.render(curSlide.data);
  return this;
};

/**
 * Return the render HTML structure of the current slide.
 */
Presentation.prototype.output = function() {
  return this.HTML;
};

exports.Presentation = Presentation;
