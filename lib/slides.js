/**
 * @file Load the slides object form the YAML file format and process it.
 * @module lib/slides
 */

const fs = require('fs');
const yaml = require('js-yaml');
const path = require('path');
const {instantiateMaster} = require('./masters.js');

/**
 * Parse the object representation of all slides.
 */
class Slides {

  /**
   * @param {string} yamlFile Path of the yaml file.
   * @param {object} document The HTML DOM Document Object.
   * @param {object} presentation The object representation of the presentation.
   * @constructor
   */
  constructor(yamlFile, document, presentation) {
    this.yamlFile = yamlFile;
    this.document = document;
    this.presentation = presentation;
  }

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
  readYamlFile(yamlFile) {
    try {
      return yaml.safeLoad(fs.readFileSync(yamlFile, 'utf8'));
    } catch (e) {
      throw e;
    }
  }

  /**
   * Instantiate slide: Load master slide class
   */
  instantiateSlide(slide, index) {
    let no = index + 1;
    let master = Object.keys(slide)[0];

    return instantiateMaster(
      master,
      this.document,
      this.presentation,
      {
        data: slide[master],
        slideNo: no
      }
    );
  }

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
   */
  parseSlides(yamlRaw) {
    let out = {};

    yamlRaw.forEach((slide, index) => {
      out[index + 1] = this.instantiateSlide(slide, index);
    });

    return out;
  }

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
   */
  parse() {
    return this.parseSlides(
      this.readYamlFile(this.yamlFile)
    );
  }

}

exports.Slides = Slides;
