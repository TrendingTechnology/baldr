/**
 * @file Entry file of the render process. Assemble all classes
 */

const mousetrap = require('mousetrap');
const {remote, ipcRenderer} = require('electron');
const {loadMaster, LoadMasters} = require('baldr-masters');

const {Presentation} = require('./lib/presentation.js');
const {Themes} = require('./lib/themes.js');
const {Config} = require('./lib/config.js');

const {audio} = require('baldr-media');

let presentation;

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
 * Show a master slide without custom data.
 *
 * The displayed master slide is not part of the acutal presentation.
 * Not every master slide can be shown with this function. It muss be
 * possible to render the master slide without custom data.
 * No number is assigned to the master slide.
 * @param {string} name Name of the master slide
 */
let setMaster = function(name) {
  let master = loadMaster(name, document, presentation);
  master.set();
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
  document.getElementById('slide').innerHTML = `
  <p>${message}</p>
  <p>Source: ${source}</p>
  <p>Line number: ${lineNo}</p>
  <p>Column number: ${colNo}</p>
  <pre>${error.stack}</pre>
  `;
};

/**
 * Search for a *.baldr session file in the argv array. Return the last
 * matched element.
 *
 * @param {array} argv Arguments in process.argv
 *
 * @return {string} The path of a BALDUR file.
 */
let searchForBaldrFile = function(argv) {
  let clone = argv.slice(0);
  clone.reverse();

  for (let arg of clone) {
    if (arg.search(/\.baldr$/ig) > -1) {
      return arg;
    }
  }
  throw new Error('No presentation file with the extension *.baldr found!');
};

/**
 * Initialize the presentaton session.
 */
let main = function() {
  audio.elemMediaInfo = document.getElementById('media-info');
  window.onerror = errorPage;
  let config = new Config(
    searchForBaldrFile(remote.process.argv)
  );
  ipcRenderer.on('set-master', function(event, masterName) {
    setMaster(masterName);
  });

  let themes = new Themes(document);
  themes.loadThemes();

  presentation = new Presentation(
    searchForBaldrFile(remote.process.argv),
    document
  );

  const masters = new LoadMasters(document, presentation);

  presentation.set();

  bindFunctions(
    [
      {
        function: () => {presentation.prevStep();},
        keys: ['up'],
        IDs: ['nav-step-prev']
      },
      {
        function: () => {presentation.nextStep();},
        keys: ['down'],
        IDs: ['nav-step-next']
      },
      {
        function: () => {presentation.prev().set();},
        keys: ['left'],
        IDs: ['nav-slide-prev']
      },
      {
        function: () => {presentation.next().set();},
        keys: ['right'],
        IDs: ['nav-slide-next']
      },
      {
        function: toggleModal,
        keys: ['esc'],
        IDs: ['modal-open', 'modal-close']
      },
      {
        function: () => {setMaster('camera');},
        keys: ['ctrl+alt+c']
      },
      {
        function: () => {setMaster('editor');},
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
