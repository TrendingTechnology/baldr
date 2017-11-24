/**
 * @file Entry file of the render process. Assemble all classes
 */

const path = require('path');
const mousetrap = require('mousetrap');
const {remote, ipcRenderer} = require('electron');

const {
  addCSSFile,
  getConfig
} = require('baldr-library');

const {
  getMasters,
  getSlides,
  SlidesSwitcher,
  getThemes
} = require('baldr-application');

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

let setMain = function(slide, config, masters) {
  let master = masters[slide.master];
  let elements = {
    slide: document.getElementById('slide-content'),
    modal: document.getElementById('modal-content')
  };

  let dataset = document.body.dataset;
  dataset.master = slide.master;
  dataset.centerVertically = master.config.centerVertically;
  dataset.theme = master.config.theme;

  elements.slide.innerHTML = master.mainHTML(
    slide,
    config,
    document
  );
  elements.modal.innerHTML = master.modalHTML();

  master.postSet(slide, config, document);
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
let setMaster = function(masterName, config, masters) {
  setMain({"master": masterName}, config, masters);
};


/**
 * Initialize the presentaton session.
 */
let main = function() {
  window.onerror = errorPage;
  ipcRenderer.on('set-master', function(event, masterName) {
    setMaster(masterName);
  });
  let config = getConfig(remote.process.argv);

  masters = getMasters();

  masters.execAll('init', document, config);
  slides = getSlides(config.slides, config, document, masters);

  let slidesSwitcher = new SlidesSwitcher(slides, document, masters);

  let themes = getThemes(document);

  for (let master of masters.all) {
    if (masters[master].css) {
      addCSSFile(
        document,
        path.join(masters[master].path, 'styles.css'),
        'baldr-master'
      );
    }
  }

  let currentSlide;

  let setSlide = function() {
    setMain(currentSlide, config, masters);
    currentSlide.steps.visit();
  };

  let stepPrev = function() {
    currentSlide.steps.prev();
  };

  let stepNext = function() {
    currentSlide.steps.next();
  };

  let slidePrev = function() {
    currentSlide = slidesSwitcher.prev();
    setSlide();
  };

  let slideNext = function() {
    currentSlide = slidesSwitcher.next();
    setSlide();
  };

  let setMasterCamera = function() {
    setMaster('camera', config, masters);
  };

  let setMasterEditor = function() {
    setMaster('editor', config, masters);
  };

  currentSlide = slidesSwitcher.getByNo(1);
  setSlide();

  bindFunctions(
    [
      {
        function: stepPrev,
        keys: ['up'],
        IDs: ['nav-step-prev']
      },
      {
        function: stepNext,
        keys: ['down'],
        IDs: ['nav-step-next']
      },
      {
        function: slidePrev,
        keys: ['left'],
        IDs: ['nav-slide-prev']
      },
      {
        function: slideNext,
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
