/**
 * @file Load the slides object form the YAML file format and process it.
 */

const fs = require('fs');
const yaml = require('js-yaml');
const path = require('path');

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
  if (fs.existsSync(
    path.join(__dirname, '..', 'masters', master, 'styles.css'))
  ) {
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

exports.Slides = Slides;
