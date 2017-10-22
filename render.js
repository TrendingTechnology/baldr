/**
 * @file Entry file of the render process.
 */

const mousetrap = require('mousetrap');
const {Presentation} = require('./presentation.js');

/**
 * @function main
 * @namespace main
 */
var main = function() {
  var prs = new Presentation('presentation.yml');
  var slideSel = document.querySelector('#slide');

  /**
   * Fill the #slide tag with the HTML code of the previous slide.
   * @function previousSlide
   * @memberof main
   * @inner
   */
  var previousSlide = function() {
    slideSel.innerHTML = prs.prev().render().output();
  };

  /**
   * Fill the #slide tag with the HTML code of the previous slide.
   * @function nextSlide
   * @memberof main
   * @inner
   */
  var nextSlide = function() {
    slideSel.innerHTML = prs.next().render().output();
  };

  slideSel.innerHTML = prs.render().output();
  mousetrap.bind('left', previousSlide);
  mousetrap.bind('right', nextSlide);
};

if (require.main === module) {
  main();
}
