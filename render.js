/**
 * @file Index file of the render process.
 */

const fs = require('fs');
const mousetrap = require('mousetrap');
const path = require('path');

//const slides = require('./slides.js')('presentation.yml');


//let slides = document.querySelector('#slide');
//slides.innerHTML = this.innerHTML;

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
