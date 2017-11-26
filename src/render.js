/**
 * @file Entry file of the render process. Assemble all classes
 */

'use strict';

const path = require('path');
const mousetrap = require('mousetrap');
const {remote, ipcRenderer} = require('electron');
const {ShowRunner} = require('baldr-application');

/* jshint -W117 */

/**
 * Toogle the modal window
 */
let toggleModal = function() {
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
 *
 */
let bindFunction = function(binding) {
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
let bindFunctions = function(bindings) {
  for (let binding of bindings) {
    bindFunction(binding);
  }
};

/**
 *
 */
let errorPage = function(message, source, lineNo, colNo, error) {
  document.getElementById('slide-content').innerHTML = `
  <p>${message}</p>
  <p>Source: ${source}</p>
  <p>Line number: ${lineNo}</p>
  <p>Column number: ${colNo}</p>
  <pre>${error.stack}</pre>
  `;
};

/**
 * Initialize the presentaton session.
 */
let main = function() {
  window.onerror = errorPage;
  let show = new ShowRunner(remote.process.argv, document);
  ipcRenderer.on('set-master', function(event, masterName) {
    show.setInstantSlide(masterName);
  });

  bindFunctions(
    [
      {
        function: () => {show.stepPrev();},
        keys: ['up'],
        IDs: ['nav-step-prev']
      },
      {
        function: () => {show.stepNext();},
        keys: ['down'],
        IDs: ['nav-step-next']
      },
      {
        function: () => {show.slidePrev();},
        keys: ['left'],
        IDs: ['nav-slide-prev']
      },
      {
        function: () => {show.slideNext();},
        keys: ['right'],
        IDs: ['nav-slide-next']
      },
      {
        function: toggleModal,
        keys: ['esc'],
        IDs: ['modal-open', 'modal-close']
      },
      {
        function: () => {show.setInstantSlide('camera');},
        keys: ['ctrl+alt+c']
      },
      {
        function: () => {show.setInstantSlide('editor');},
        keys: ['ctrl+alt+e']
      }
    ]
  );
};

if (require.main === module) {
  main();
}
