/**
 * @file Entry file of the render process.
 */

const mousetrap = require('mousetrap');
const {Presentation} = require('./lib/presentation.js');
const misc = require('./lib/misc.js');
const {Themes} = require('./lib/themes.js');
const path = require('path');
const {remote} = require('electron');
const {ipcRenderer} = require('electron');
const {loadMaster} = require('baldr-masters');
const {audio} = require('baldr-media');


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
 * @function prevStep
 */
var prevStep = function() {
  presentation.prevStep();
};

/**
 * @function nextStep
 */
var nextStep = function() {
  presentation.nextStep();
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
  let master = loadMaster(name, document, presentation);
  master.set();
};

/**
 *
 */
var setMasterCamera = function() {
  setMaster('camera');
};

/**
 *
 */
var setMasterEditor = function() {
  setMaster('editor');
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
  window.onerror = function(message, source, lineNo, colNo, error) {
    document.getElementById('slide').innerHTML = `
    <p>${message}</p>
    <p>Source: ${source}</p>
    <p>Line number: ${lineNo}</p>
    <p>Column number: ${colNo}</p>
    <pre>${error.stack}</pre>
    `;
  };

  ipcRenderer.on('set-master', function(event, masterName) {
    setMaster(masterName);
  });

  let themes = new Themes(document);
  themes.loadThemes();

  presentation = new Presentation(
    misc.searchForBaldrFile(remote.process.argv),
    document
  );
  firstSlide();
  bindFunctions(
    [
      {
        function: prevStep,
        keys: ['up'],
        IDs: ['nav-step-prev']
      },
      {
        function: nextStep,
        keys: ['down'],
        IDs: ['nav-step-next']
      },
      {
        function: previousSlide,
        keys: ['left'],
        IDs: ['nav-slide-prev']
      },
      {
        function: nextSlide,
        keys: ['right'],
        IDs: ['nav-slide-next']
      },
      {
        function: toggleModal,
        keys: ['esc'],
        IDs: ['modal-open', 'modal-close']
      },
      {
        function: setMasterCamera,
        keys: ['ctrl+alt+c']
      },
      {
        function: setMasterEditor,
        keys: ['ctrl+alt+e']
      },
      {
        function: () => {audio.stop();},
        keys: ['ctrl+a']
      },
      {
        function: () => {audio.fadeOut();},
        keys: ['ctrl+f']
      },
      {
        function: () => {audio.pausePlay();},
        keys: ['space']
      }
    ]
  );
};

if (require.main === module) {
  main();
}
