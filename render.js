/**
 * @file Index file of the render process.
 */

const fs = require('fs');
const mousetrap = require('mousetrap');
const yaml = require('js-yaml');

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
 * Presentation - description
 *
 * @param {string} yamlFile Path of the yaml file.
 */
Presentation = function(yamlFile) {
  this.slides = loadYaml(yamlFile);
  this.slidesCount = this.slides.length;
  this.currentSlideNumber = 1;

  this.setSlide = function() {
    this.currentSlideObject = this.slides[this.currentSlideNumber - 1];
  };

  this.setSlide();
};

/**
 * Presentation.prototype.previousSlide - Display the previous slide.
 */
Presentation.prototype.previousSlide = function() {
  if (this.currentSlideNumber === 1) {
    this.currentSlideNumber = this.slidesCount;
  }
  else {
    this.currentSlideNumber = this.currentSlideNumber - 1;
  }
  this.setSlide();
};

/**
 * Presentation.prototype.nextSlide - Display the next slide.
 */
Presentation.prototype.nextSlide = function() {

  if (this.currentSlideNumber === this.slidesCount) {
    this.currentSlideNumber = 1;
  }
  else {
    this.currentSlideNumber = this.currentSlideNumber + 1;
  }
  this.setSlide();
};


var main = function() {
  prst = new Presentation('presentation.yml');

  mousetrap.bind('left', function() {
    prst.previousSlide();
  });
  mousetrap.bind('right', function() {
    prst.nextSlide();
  });
};

if (require.main === module) {
  main();
}
else {
  exports.Presentation = Presentation;
  exports.loadYaml = loadYaml;
}
