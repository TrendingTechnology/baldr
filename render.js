/**
 * @file Index file of the render process.
 */

const mousetrap = require('mousetrap');
const {Presentation} = require('./presentation.js');

var main = function() {
  var prs = new Presentation('presentation.yml');
  var slideSel = document.querySelector('#slide');

  var previousSlide = function() {
    slideSel.innerHTML = prs.prev().render().output();
  };

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
