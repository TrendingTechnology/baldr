/**
 * @file Gather informations about all available master slides
 * @module baldr-masters
 */

const fs = require('fs');
const path = require('path');

let reIndex = function(array) {
  let out = {};
  for (let index in array) {
    out[Number.parseInt(index) + 1] = array[index];
  }
  return out;
};
exports.reIndex = reIndex;

/**
 * Generate a link element and append this element to the head section
 * of the document object
 *
 * @param {object} document The HTML DOM Document Object.
 * @param {string} cssFile Path of the CSS file to include
 * @param {string} className A CSS class name to add to the link element.
 */
var addCSSFile;
exports.addCSSFile = addCSSFile = function(document, cssFile, className=false) {
  let link = document.createElement('link');
  link.rel = 'stylesheet';
  link.type = 'text/css';
  if (className) {
    link.classList.add(className);
  }
  link.href = cssFile;
  document.head.appendChild(link);
};

/**
 * Gather informations about all available master slides.
 */
class LoadMasters {

  constructor() {

    /**
     * Parent path of all master slide modules.
     * @type {string}
     */
    this.path = path.join(__dirname, '..', '..', 'masters');

    /**
     * Folder name of master slides
     * @type {array}
     */
    this.all = this.getAll();
    for (let master of this.all) {
      let masterPath = path.join(this.path, master);
      this[master] = this.setDefaults_(
        require(
          path.join(masterPath, 'index.js')
        )
      );
      this[master].name = master;
      this[master].path = masterPath;
      this[master].css = this.hasCSS_(masterPath);
    }
  }

  /**
   * @private
   */
  setDefaults_(requireObject) {
    let emptyFunc = function() {};
    let returnEmpty = function() {return '';};
    let funcFalse = function() {return false;};

    let config = {
      centerVertically: false,
      stepSupport: false,
      theme: 'default'
    };

    requireObject.config = Object.assign({}, config, requireObject.config);

    let defaultObject = {
      init: emptyFunc,
      normalizeData: function(data) {return data;},
      modalHTML: returnEmpty,
      mainHTML: returnEmpty,
      postSet: emptyFunc,
      setStepByNo: emptyFunc,
      initSteps: funcFalse,
      initStepsEveryVisit: funcFalse
    };

    return Object.assign({}, defaultObject, requireObject);
  }

  /**
   * Check if the CSS style file “styles.css” in the master slide
   * folder exists.
   *
   * @private
   */
  hasCSS_(masterPath) {
    if (fs.existsSync(path.join(masterPath, 'styles.css'))) {
      return true;
    }
    else {
      return false;
    }
  }

  execAll(hookName) {
    let args = Array.from(arguments);
    args.shift();
    for (let master of this.all) {
      this[master][hookName](...args);
    }
  }

  getHooks(hookName, type='function') {
    return this.all.filter(
      master => typeof this[master][hookName] === type
    );
  }

  /**
   * Get the folder off all master slide modules.
   * @return {array} Folder name of master slides
   */
  getAll() {
    return fs.readdirSync(this.path, 'utf8')
    .filter(
      dir => fs.statSync(
        path.join(this.path, dir)
      ).isDirectory()
    );
  }
}

let masters;
exports.masters = masters = new LoadMasters();

let setMain = function(slide, config, document) {
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

exports.setMain = setMain;
exports.LoadMasters = LoadMasters;
