/**
 * @file The current song
 */

const path = require('path');
const modal = require('./modal.js');

/**
 * The current slide number.
 */
var slideNumber = 0;

/**
 * The biggest slide number.
 */
var slideNumberMax;

/**
 * Array of all images files of a song.
 */
var slides;

/**
 * The folder containing the images files.
 */
var folder;

var songsPath;

var library;

var selector;

var set = function(values) {
  songsPath = values.songsPath;
  library = values.library;
  selector = values.selector;
};

/**
 * Set all properties for the current song.
 */
var setCurrent = function(songID) {
  var tmp = library[songID];
  if (typeof tmp !== 'undefined') {
    slideNumber = 0;
    slides = tmp.slides;
    slideNumberMax = slides.length - 1;
    folder = tmp.folder;
  }
  setSlide();
};

/**
 * Load the current image to the slide section.
 */
var setSlide = function() {
  var imagePath = path.join(folder, 'slides', slides[slideNumber]);
  jquery(selector).attr('src', imagePath);
};

/**
 * Show the next slide.
 */
var nextSlide = function() {
  slideNumber += 1;
  if (slideNumber > slideNumberMax) {
    slideNumber = 0;
  }
  setSlide();
};

/**
 * Show the previous slide.
 */
var previousSlide = function() {
  slideNumber -= 1;
  if (slideNumber < 0) {
    slideNumber = slideNumberMax;
  }
  setSlide();
};

/**
 *
 */
var loadByHash = function() {
  if (location.hash !== '') {
    setCurrent(location.hash.substring(1));
    setSlide();
    modal.hide();
  }
};

exports.loadByHash = loadByHash;
exports.nextSlide = nextSlide;
exports.previousSlide = previousSlide;
exports.set = set;
exports.setCurrent = setCurrent;
