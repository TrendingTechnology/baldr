/**
 * @file Index file of the render process.
 */

const fs = require('fs');
const mousetrap = require('mousetrap');
const path = require('path');

const slides = require('./slides.js')('presentation.yml');

/**
 * var requireMaster - description
 *
 * @param {string} masterName The name of the master slide
 * @return {object} The module object of master slide
 */
var requireMaster = function(masterName) {
  return require(
    path.resolve('masters', masterName, 'index.js')
  );
};

/**
 * Presentation - description
 *
 * @param {string} yamlFile Path of the yaml file.
 */
Presentation = function(yamlFile) {
  this.slides = loadYaml(yamlFile);
  this.count = this.slides.length;
  this.current = {};
  this.current.no = 1;const yaml = require('js-yaml');

  this.setSlide = function() {
    let index = this.current.no - 1;
    let currentObject = this.slides[index];
    this.current.master = Object.keys(currentObject)[0];
    this.current.data = currentObject[this.current.master];

    let master = require(path.resolve('masters', this.current.master, 'index.js'));
    this.innerHTML = master.render(this.current.data);
    let slides = document.querySelector('#slide');
    slides.innerHTML = this.innerHTML;
  };

  this.setSlide();
};

/**
 * Presentation.prototype.previousSlide - Display the previous slide.
 */
Presentation.prototype.previousSlide = function() {
  if (this.current.no === 1) {
    this.current.no = this.count;
  }
  else {
    this.current.no = this.current.no - 1;
  }
  this.setSlide();
};

/**
 * Presentation.prototype.nextSlide - Display the next slide.
 */
Presentation.prototype.nextSlide = function() {

  if (this.current.no === this.count) {
    this.current.no = 1;
  }
  else {
    this.current.no = this.current.no + 1;
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
