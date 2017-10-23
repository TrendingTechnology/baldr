/**
 * @file Load the slides object form the YAML file format and process it.
 */

const fs = require('fs');
const yaml = require('js-yaml');
const path = require('path');

/**
 * TODO: Move to another file
 * @param {string} masterName The name of the master slide
 * @return {object} The module object of master slide
 */
var requireMaster = function(masterName) {
  return require(
    path.join(__dirname, 'masters', masterName, 'index.js')
  );
};

/**
 * TODO: Move to another file
 * Search for a *.baldr file in the argv array. Return the last
 * matched element.
 *
 * @param {array} argv Arguments in process.argv
 * @return {string} The path of a BALDUR file.
 */
var searchForBaldrFile = function(argv) {
  let clone = argv.slice(0);
  clone.reverse();

  for (let arg of clone) {
    if (arg.search(/\.baldr$/ig) > -1) {
      return arg;
    }
  }
  return false;
};

/**
 * Parse the object representation of all slides.
 *
 * @param {string} yamlFile Path of the yaml file.
 * @constructor
 */
var Slides = function(yamlFile) {
  this.yamlFile = yamlFile;
};

/**
 * Load the content of a yaml file and convert its content into a
 * object.
 * @param {string} yamlFile Path of the yaml file.
 * @return {object} Object representation of the yaml file.
 * <pre><code>
 * [
 *   {
 *     "quote": {
 *       "text": "text",
 *       "author": "author",
 *       "date": "date"
 *     }
 *   },
 *   {
 *     "question": [
 *       {
 *         "question": "question",
 *         "answer": "answer"
 *       }
 *     ]
 *   },
 *   {
 *     "person": {
 *       "name": "name",
 *       "image": "image"
 *     }
 *   }
 * ]
 * </code><pre>
 */
Slides.prototype.readYamlFile = function(yamlFile) {
  try {
    return yaml.safeLoad(fs.readFileSync(yamlFile, 'utf8'));
  } catch (e) {
    throw e;
  }
};

/**
 * Process meta data for one slide.
 *
 * @param {type} slide A raw slide object.
 * @param {type} index The array index (0 - ...)
 * @return {object}
 * <pre><code>
 * {
 *   "no": 1,
 *   "master": "quote",
 *   "data": {
 *     "text": "Der Tag der Gunst ist wie der Tag der Ernte,\nman muss geschäftig sein sobald sie reift.\n",
 *     "author": "Johann Wolfgang von Goethe",
 *     "date": 1801
 *   },
 *   "css": true
 * }
 * </code><pre>
 */
Slides.prototype.parseSlide = function(slide, index) {
  let no = index + 1;
  let master = Object.keys(slide)[0];
  let css = false;
  if (fs.existsSync(path.join(__dirname, 'masters', master, 'styles.css'))) {
    css = true;
  }
  return {
    "no": no,
    "master": master,
    "data": slide[master],
    "css": css
  };
};

/**
 * @param {array} yamlRaw The yaml file converted in an array of objects.
 * @return {object} Processed object of slides
 * <pre><code>
 * {
 *   "1": {
 *     "no": 1,
 *     "master": "quote",
 *     "data": {
 *       "text": "Der Tag der Gunst ist wie der Tag der Ernte,\nman muss geschäftig sein sobald sie reift.\n",
 *       "author": "Johann Wolfgang von Goethe",
 *       "date": 1801
 *     },
 *     "css": true
 *   },
 *   "2": {
 *     "no": 2,
 *     "master": "question",
 *     "data": [
 *       {
 *         "question": "Wann starb Ludwig van Beethoven?",
 *         "answer": 1827
 *       }
 *     ],
 *     "css": false
 *   },
 *   "3": {
 *     "no": 3,
 *     "master": "person",
 *     "data": {
 *       "name": "Ludwig van Beethoven",
 *       "image": "beethoven.jpg"
 *     },
 *     "css": false
 *   }
 * }
 * </code><pre>
 */
Slides.prototype.parseSlides = function(yamlRaw) {
  let out = {};

  yamlRaw.forEach((slide, index) => {
    out[index + 1] = this.parseSlide(slide, index);
  });

  return out;
};

/**
 * Parse the yaml file.
 * @return {object} Processed object of slides
 * <pre><code>
 * {
 *   "1": {
 *     "no": 1,
 *     "master": "quote",
 *     "data": {
 *       "text": "Der Tag der Gunst ist wie der Tag der Ernte,\nman muss geschäftig sein sobald sie reift.\n",
 *       "author": "Johann Wolfgang von Goethe",
 *       "date": 1801
 *     },
 *     "css": true
 *   },
 *   "2": {
 *     "no": 2,
 *     "master": "question",
 *     "data": [
 *       {
 *         "question": "Wann starb Ludwig van Beethoven?",
 *         "answer": 1827
 *       }
 *     ],
 *     "css": false
 *   },
 *   "3": {
 *     "no": 3,
 *     "master": "person",
 *     "data": {
 *       "name": "Ludwig van Beethoven",
 *       "image": "beethoven.jpg"
 *     },
 *     "css": false
 *   }
 * }
 * </code><pre>
 */
Slides.prototype.parse = function() {
  return this.parseSlides(
    this.readYamlFile(this.yamlFile)
  );
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
   *     },
   *     "css": true
   *   },
   *   "2": {
   *     "no": 2,
   *     "master": "question",
   *     "data": [
   *       {
   *         "question": "Wann starb Ludwig van Beethoven?",
   *         "answer": 1827
   *       }
   *     ],
   *     "css": false
   *   },
   *   "3": {
   *     "no": 3,
   *     "master": "person",
   *     "data": {
   *       "name": "Ludwig van Beethoven",
   *       "image": "beethoven.jpg"
   *     },
   *     "css": false
   *   }
   * }
   * </code><pre>
   * @type {object}
   */
  this.slides = new Slides(yamlFile).parse();

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
   * The current slide object.
   * @type {object}
   */
  this.currentSlide = this.slides[this.no];

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
  this.currentSlide = this.slides[this.no];
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
  this.currentSlide = this.slides[this.no];
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
exports.searchForBaldrFile = searchForBaldrFile;
