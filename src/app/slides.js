/**
 * @file Load the slides object form the YAML file format and process it.
 * @module lib/slides
 */

const fs = require('fs');
const path = require('path');
const {StepSwitcher} = require(path.join(__dirname, 'step-switcher.js'));

/**
 * Parse the object representation of all slides.
 */
class Slides {

  /**
   * @param {array} raw A raw array of all slide objects.
   */
  constructor(rawSlides, config, document, masters) {
    this.rawSlides = rawSlides;
    this.config = config;
    this.document = document;
    this.masters = masters;
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
  assembleSlide(rawSlide, index) {
    let slide = {};
    slide.no = index + 1;

    let intersection = this.intersectMastersSlideKeys(
      this.masters.all,
      Object.keys(rawSlide)
    );

    if (intersection.length > 1) {
      throw Error('Each slide must have only one master slide.');
    }

    slide.master = intersection[0];
    slide.rawData = rawSlide[slide.master];
    slide.normalizedData = this.masters[slide.master]
      .normalizeData(slide.rawData, this.config);
    slide.steps = new StepSwitcher(this.document, slide, this.config, this.masters);

    return slide;
  }

  get() {
    let out = {};

    this.rawSlides.forEach((rawSlide, index) => {
      out[index + 1] = this.assembleSlide(rawSlide, index);
    });

    return out;
  }

}

exports.getSlides = function(rawSlides, config, document, masters) {
  return new Slides(rawSlides, config, document, masters).get();
}
