/**
 * @file Entry file of the render process.
 */

const mousetrap = require('mousetrap');
const {Presentation} = require('./presentation.js');

/**
 * @namespace main
 * @function main
 */
var main = function() {
  var prs = new Presentation('presentation.yml');

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
   * Fill the #slide tag with the HTML code of the previous slide.
   * @function previousSlide
   * @memberof main
   * @inner
   */
  var previousSlide = function() {
    let prev = prs.prev().render();
    setSlideHTML(prev.HTML);
  };

  /**
   * Fill the #slide tag with the HTML code of the previous slide.
   * @function nextSlide
   * @memberof main
   * @inner
   */
  var nextSlide = function() {
    let next = prs.next().render();
    setSlideHTML(next.HTML);
  };

  let cur = prs.render();
  setSlideHTML(cur.HTML);
  mousetrap.bind('left', previousSlide);
  mousetrap.bind('right', nextSlide);
};

if (require.main === module) {
  main();
}
