/**
 * @file Entry file of the render process.
 */

const mousetrap = require('mousetrap');
const {Presentation} = require('./lib/presentation.js');
const misc = require('./lib/misc.js');
const path = require('path');
const {remote} = require('electron');
const {ipcRenderer} = require('electron');
const Masters = require('./lib/masters.js').Masters;

let masters;
let presentation;

/**
 * Toogle the modal window
 */
var toggleModal = function() {
  let modal = document.getElementById('modal');
  let state = modal.style.display;
  if (state === 'none') {
    modal.style.display = 'block';
    return 'block';
  }
  else if (state === 'block') {
    modal.style.display = 'none';
    return 'none';
  }
  else {
    return false;
  }
};

/**
 * Update the HTML structure with the code of the previous slide.
 * @function previousSlide
 */
var previousSlide = function() {
  presentation.prev().set();
};

/**
 * Update the HTML structure with the code of the next slide.
 * @function nextSlide
 */
var nextSlide = function() {
  presentation.next().set();
};

/**
 * Set the first slide when loading the presentation.
 * @function firstSlide
 */
var firstSlide = function() {
  presentation.set();
};

/**
 * Show a master slide without custom data.
 *
 * The displayed master slide is not part of the acutal presentation.
 * Not every master slide can be shown with this function. It muss be
 * possible to render the master slide without custom data.
 * No number is assigned to the master slide.
 * @param {string} name Name of the master slide
 */
var setMaster = function(name) {
  let master = masters[name];
  master.set();
};

/**
 *
 */
var bindFunction = function(binding) {
  if (binding.keys) {
    for (let key of binding.keys) {
      mousetrap.bind(key, binding.function);
    }
  }

  if (binding.IDs) {
    for (let ID of binding.IDs) {
      document
        .getElementById(ID)
        .addEventListener('click', binding.function);
    }
  }
};

/**
 *
 */
var bindFunctions = function(bindings) {
  for (let binding of bindings) {
    bindFunction(binding);
  }
};

/**
 * @function main
 */
var main = function() {
  ipcRenderer.on('set-master', function(event, masterName) {
    setMaster(masterName);
  });

  presentation = new Presentation(
    misc.searchForBaldrFile(remote.process.argv),
    document
  );
  masters = new Masters(document, presentation);
  firstSlide();
  bindFunctions(
    [
      {
        function: previousSlide,
        keys: ['left'],
        IDs: ['button-left']
      },
      {
        function: nextSlide,
        keys: ['right'],
        IDs: ['button-right']
      },
      {
        function: toggleModal,
        keys: ['esc'],
        IDs: ['modal-open', 'modal-close']
      }
    ]
  );
};

if (require.main === module) {
  main();
}
