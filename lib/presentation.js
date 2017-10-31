/**
 * @file Load the slides object form the YAML file format and process it.
 * @module lib/presentation
 */

const fs = require('fs');
const path = require('path');
const misc = require('../lib/misc.js');
const {Slides} = require('../lib/slides.js');
const {Masters} = require('../lib/masters.js');

/**
 * @param {string} yamlFile Path of the yaml file.
 * @param {object} document The HTML DOM Document Object.
 * @constructor
 */
var Presentation = function(yamlFile, document) {

  /**
   * The presentation files’ parent working directory. Assuming you are
   * loading a file with the path “/home/jf/example.baldr”, your parent
   * working directory (pwd) is than “/home/jf”
   * @type {string}
   */
  this.pwd = path.resolve(path.dirname(yamlFile));

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
  this.slides = new Slides(yamlFile, document).parse();

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
   * Object of all master slides
   * @type {object}
   */
  this.masters = new Masters(document);

  /**
   * The HTML code of the current slide.
   * @type {string}
   */
  this.HTML = '';

  this.document = document;
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
 * Set the current slide
 */
Presentation.prototype.set = function() {
  this.currentSlide.set();
  return this;
};

exports.Presentation = Presentation;
