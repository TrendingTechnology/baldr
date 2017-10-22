/**
 * @file Entry file of the render process.
 */

const mousetrap = require('mousetrap');
const {Presentation} = require('./presentation.js');
const path = require('path');
const {remote} = require('electron');

/**
 * @namespace main
 * @function main
 */
var main = function() {
  var prs = new Presentation(remote.process.argv[1]);

  /**
   * Fill the #slide tag with HTML form the slides.
   * @function setSlideHTML
   * @memberof main
   * @inner
   * @param {string} HTML HTML code
   */
  var setSlideHTML = function(HTML) {
    document.querySelector('#slide').innerHTML = HTML;
  };

  /**
   * Add and remove master slide specific CSS styles
   * @function setSlideCSS
   * @memberof main
   * @inner
   * @param {object} slide The object of the current slide
   */
  var setSlideCSS = function(slide) {
    if (slide.css) {
      let head = document.getElementsByTagName('head')[0];
      let link = document.createElement('link');
      link.id = 'current-master';
      link.rel = 'stylesheet';
      link.type = 'text/css';
      link.href = path.join('masters', slide.master, 'styles.css');
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
   * @memberof main
   * @inner
   * @param {object} pres The object presentation object
   */
  var setSlide = function(pres) {
    setSlideCSS(pres.currentSlide);
    setSlideHTML(pres.HTML);
  };

  /**
   * Update the HTML structure with the code of the previous slide.
   * @function previousSlide
   * @memberof main
   * @inner
   */
  var previousSlide = function() {
    setSlide(prs.prev().render());
  };

  /**
   * Update the HTML structure with the code of the next slide.
   * @function nextSlide
   * @memberof main
   * @inner
   */
  var nextSlide = function() {
    setSlide(prs.next().render());
  };

  /**
   * Set the first slide when loading the presentation.
   * @function firstSlide
   * @memberof main
   * @inner
   */
  var firstSlide = function() {
    setSlide(prs.render());
  };

  firstSlide();
  mousetrap.bind('left', previousSlide);
  mousetrap.bind('right', nextSlide);
};

if (require.main === module) {
  main();
}
