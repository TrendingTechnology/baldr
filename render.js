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
  audio.elemMediaInfo = document.getElementById('media-info');

  //const {Menu, MenuItem} = remote;
  //const menu = Menu.getApplicationMenu()

  //console.log(menu.items[0].submenu.items[0].label);
  //menu.append(new MenuItem({label: 'MenuItem1', click() { console.log('item 1 clicked') }}))
  //menu.items[0].submenu.items[0].label = 'lol';
  //Menu.setApplicationMenu(menu);
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
