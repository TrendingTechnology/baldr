/**
 * @file Load the slides object form the YAML file format and process it.
 * @module lib/slides
 */

const fs = require('fs');
const path = require('path');
const {loadMaster, LoadMasters} = require('baldr-masters');

const masters = new LoadMasters();

/**
 * Parse the object representation of all slides.
 */
class Slides {

  /**
   * @param {array} rawSlides A raw array of all slide objects.
   * @param {object} document The HTML DOM Document Object.
   * @param {object} presentation The object representation of the p
   * resentation.
   */
  constructor(rawSlides, document, presentation) {
    this.raw = rawSlides;
    this.document = document;
    this.presentation = presentation;
  }

  /**
   * Get the intersection between all master names and the slide keys.
   *
   * This method can be used to check that a slide object uses only
   * one master slide.
   *
   * @param {array} masterNames
   * @param {array} slideKeys
   * @return {array} The intersection as an array
   */
  intersectMastersSlideKeys(masterNames, slideKeys) {
    return masterNames.filter((n) => slideKeys.includes(n));
  }

  /**
   * Instantiate slide: Load master slide class
   *
   * @param {object} slide
   * @param {integer} index The index of the slide array
   * @return {object} A master slide object
   */
  instantiateSlide(slide, index) {
    let no = index + 1;

    let intersection = this.intersectMastersSlideKeys(
      masters.all,
      Object.keys(slide)
    );

    if (intersection.length > 1) {
      throw Error('Each slide must have only one master slide.');
    }

    let master = intersection[0];

    return loadMaster(
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
    return this.parseSlides(this.raw);
  }

}

exports.Slides = Slides;
