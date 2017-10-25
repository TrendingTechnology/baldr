/**
 * @file Entry file of the render process.
 */

const mousetrap = require('mousetrap');
const {Presentation} = require('./lib/presentation.js');
const misc = require('./lib/misc.js');
const path = require('path');
const {remote} = require('electron');
const Masters = require('./lib/masters.js').Masters;
const masters = new Masters();

let baldrFile = misc.searchForBaldrFile(
  remote.process.argv
);
var presentation = new Presentation(baldrFile);

/**
 * Fill the #slide tag with HTML form the slides.
 * @function setSlideHTML
 * @param {string} HTML HTML code
 */
var setSlideHTML = function(HTML) {
  document.querySelector('#slide').innerHTML = HTML;
};

/**
 * Add and remove master slide specific CSS styles
 * @function setSlideCSS
 * @param {object} slide The object of the current slide
 */
var setSlideCSS = function(slide) {
  let master = masters[slide.master];
  if (master.css) {
    let head = document.getElementsByTagName('head')[0];
    let link = document.createElement('link');
    link.id = 'current-master';
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = path.join(master.path, master.css);
    head.appendChild(link);
  }
  else {
    let link = document.querySelector('#current-master');
    if (link) {
      link.remove();
    }
  }
};

/**
 * Update HTML for the current slide
 * @function setSlide
 * @param {object} pres The object presentation object
 */
var setSlide = function(pres) {
  setSlideCSS(pres.currentSlide);
  setSlideHTML(pres.HTML);
  pres.postRender(document);
};

/**
 * Update the HTML structure with the code of the previous slide.
 * @function previousSlide
 */
var previousSlide = function() {
  setSlide(presentation.prev().render());
};

/**
 * Update the HTML structure with the code of the next slide.
 * @function nextSlide
 */
var nextSlide = function() {
  setSlide(presentation.next().render());
};

/**
 * Set the first slide when loading the presentation.
 * @function firstSlide
 */
var firstSlide = function() {
  setSlide(presentation.render());
};

/**
 * @function main
 */
var main = function() {
  firstSlide();
  mousetrap.bind('left', previousSlide);
  mousetrap.bind('right', nextSlide);
};

if (require.main === module) {
  main();
}
