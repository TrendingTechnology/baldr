/**
 * @file Load the slides object form the YAML file format and process it.
 */

const fs = require('fs');
const path = require('path');
const misc = require('../lib/misc.js');
const {Slides} = require('../lib/slides.js');
const {Masters} = require('../lib/masters.js');

/**
 * @param {string} yamlFile Path of the yaml file.
 * @constructor
 */
var Presentation = function(yamlFile) {

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
   * Object of all master slides
   * @type {object}
   */
  this.masters = new Masters();

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
  this.HTML = this.masters[this.currentSlide.master]
    .app
    .render(this.currentSlide.data, this);
  return this;
};

/**
 *
 */
Presentation.prototype.postRender = function(document) {
  this.masters[this.currentSlide.master]
    .app
    .postRender(document);
  return this;
};

/**
 * Return the render HTML structure of the current slide.
 */
Presentation.prototype.output = function() {
  return this.HTML;
};

exports.Presentation = Presentation;
