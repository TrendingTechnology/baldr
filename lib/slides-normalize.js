/**
 * @file Load the slides object form the YAML file format and process it.
 * @module lib/slides
 */

const fs = require('fs');
const path = require('path');
const {masters} = require('baldr-masters');

/**
 * Parse the object representation of all slides.
 */
class SlidesNormalize {

  /**
   * @param {array} raw A raw array of all slide objects.
   */
  constructor(raw) {
    this.raw = raw;
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
  normalize(slide, index) {
    let out = {};
    out.no = index + 1;

    let intersection = this.intersectMastersSlideKeys(
      masters.all,
      Object.keys(slide)
    );

    if (intersection.length > 1) {
      throw Error('Each slide must have only one master slide.');
    }

    out.master = intersection[0];
    out.data = slide[out.master];
    return out;
  }

  /**
   * @param {array} raw The yaml file converted in an array of objects.
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
  reIndex(raw) {
    let out = {};

    raw.forEach((slide, index) => {
      out[index + 1] = this.normalize(slide, index);
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
  get normalized() {
    return this.reIndex(this.raw);
  }

}

exports.SlidesNormalize = SlidesNormalize;
