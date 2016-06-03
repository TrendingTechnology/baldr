/***********************************************************************
 * 'song': The current song
 **********************************************************************/

var pth = require('path');

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

exports.set = function(values) {
  songsPath = values.songsPath;
  library = values.library;
  selector = values.selector;
}

/**
 * Set all properties for the current song.
 */
exports.setCurrent = function(songID) {
  var tmp = library[songID];
  if (typeof tmp != 'undefined') {
    slideNumber = 0;
    slides = tmp.slides;
    slideNumberMax = slides.length - 1;
    folder = tmp.folder;
  }
  setSlide();
}

/**
 * Load the current image to the slide section.
 */
setSlide = function() {
  var imagePath = pth.join(songsPath, folder, 'slides', slides[slideNumber])
  $(selector).attr('src', imagePath);
}

/**
 * Show the next slide.
 */
exports.nextSlide = function() {
  slideNumber += 1;
  if (slideNumber > slideNumberMax) {
    slideNumber = 0;
  }
  setSlide();
}

/**
 * Show the previous slide.
 */
exports.previousSlide = function() {
  slideNumber -= 1;
  if (slideNumber < 0) {
    slideNumber = slideNumberMax;
  }
  setSlide();
}

/**
 *
 */
exports.loadByHash = function() {
  if (location.hash != '') {
    setCurrent(location.hash.substring(1));
    setSlide();
  }
}
