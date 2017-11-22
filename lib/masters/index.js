/**
 * @file Gather informations about all available master slides
 * @module baldr-masters
 */

const fs = require('fs');
const path = require('path');

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
 * Load the master slide class
 *
 * @param {string} masterName The name of the master slide
 * @param {object} document The HTML DOM Document Object.
 * @param {object} presentation The presentation object.
 * @param {object} propObj Additonal properties for the slides and
 *   master objects that gets merged in the instatiated object.
 */
var loadMaster = function(masterName, document, presentation, propObj) {
  let moduleName = 'baldr-master-' + masterName;

  let className = 'Master' +
    masterName.charAt(0).toUpperCase() +
    masterName.slice(1);

  let properties = {
    "masterPath": path.dirname(require.resolve(moduleName)),
    "masterName": masterName,
    "document": document,
    "presentation": presentation
  };

  let masters = new LoadMasters(document, presentation);
  let Master = masters[masterName].Master;
  return new Master(Object.assign({}, properties, propObj));
};

/**
 * Each master slide class extends this class. It provides basic
 * functionality for the master slide classes. This class is a
 * interface for all child classes
 *
 * @interface
 */
var MasterOfMasters = class {

  /**
   * @param {object} propObj
   * @param {string} propObj.masterName Name of the master slide.
   * @param {string} propObj.masterPath Path of the master slide folder.
   * @param {object} propObj.document Javascript document object (DOM) of the render.html
   * @param {object} propObj.presentation The object representation of the presentation.
   * @param {object} propObj.data The slide data
   */
  constructor(propObj) {

    for (let property in propObj) {
      this[property] = propObj[property];
    }

    /**
     * @memberof MasterOfMasters HTML-Element for the slide content.
     * @type {object}
     */
    this.elemSlide = this.document.getElementById('slide-content');

    /**
     * The HTML-Element for the modal content.
     * @type {object}
     */
    this.elemModal = this.document.getElementById('modal-content');

    /**
     * The HTML-Button-Element that triggers the previous step.
     * @type {object}
     */
    this.elemStepPrev = this.document.getElementById('nav-step-prev');

    /**
     * The HTML-Button-Element that triggers the next step.
     * @type {object}
     */
    this.elemStepNext = this.document.getElementById('nav-step-next');

    /**
     * The count of steps. (Default: 0)
     * @type {integer}
     */
    this.stepCount = 0;

    /**
     * The current step number. (Default: 0)
     * @type {integer}
     */
    this.stepNo = 0;

    /**
     * Object to store data for the individual steps. The step data
     * should be indexed by the step number.
     * @type {object}
     */
    this.stepData = {};

    /**
     * Indicates whether the master slide is already set.
     * @type {boolean}
     */
    this.alreadySet = false;

    /**
     * Set this property to true to center the slide content vertically
     * @type {boolean}
     */
    this.centerVertically = false;

    /**
     * The default theme
     * @type {string}
     */
    this.theme = 'default';
  }

  /**
   * Check if the CSS style file “styles.css” in the master slide
   * folder exists.
   */
  hasCSS() {
    if (fs.existsSync(path.join(this.masterPath, 'styles.css'))) {
      return true;
    }
    else {
      return false;
    }
  }

  /**
   * Add and remove master slide specific CSS styles
   */
  setCSS() {
    if (this.hasCSS()) {
      addCSSFile(
        this.document,
        path.join(this.masterPath, 'styles.css'),
        'baldr-master'
      );
    }
  }

  /**
   * @private
   */
  setStepButtonsVisibility_(state) {
    this.elemStepNext.style.visibility = state;
    this.elemStepPrev.style.visibility = state;
  }

  /**
   * @private
   */
  displayStepButtons_() {
    if (this.stepCount > 1) {
      this.setStepButtonsVisibility_('visible');
    }
    else {
      this.setStepButtonsVisibility_('hidden');
    }
  }

  /**
   *
   */
  set() {
    this.hookPreSet();
    this.setCSS();
    this.elemSlide.innerHTML = this.hookSetHTMLSlide();
    this.elemModal.innerHTML = this.hookSetHTMLModal();
    this.document.body.dataset.master = this.masterName;
    this.document.body.dataset.centerVertically = this.centerVertically;
    this.document.body.dataset.theme = this.theme;
    if (!this.alreadySet) {
      this.hookPostFirstSet();
    }
    this.hookPostSet();
    this.alreadySet = true;
    this.displayStepButtons_();
  }

  /**
   * @private
   */
  afterStepNoChange_() {
    if (this.stepNo === 1) {
      this.hookPreFirstStep();
    }
    if (this.stepNo === this.stepCount) {
      this.hookPreLastStep();
    }
    this.hookSetStep();
  }

  /**
   *
   */
  prevStep() {
    if (this.stepNo === 1) {
      this.stepNo = this.stepCount;
    }
    else {
      this.stepNo--;
    }
    this.afterStepNoChange_();
    this.hookPrevStep();
  }

  /**
   *
   */
  nextStep() {
    if (this.stepNo === this.stepCount) {
      this.stepNo = 1;
    }
    else {
      this.stepNo++;
    }
    this.afterStepNoChange_();
    this.hookNextStep();
  }

  /**
   *
   */
  hookPreSet() {}

  /**
   * @return {string} HTML markup which is shown inside the slide element
   */
  hookSetHTMLSlide() {
    return 'No slide loaded.';
  }

  /**
   *
   */
  hookSetHTMLModal() {
    return '';
  }

  /**
   *
   */
  hookPostFirstSet() {}

  /**
   *
   */
  hookPostSet() {}


  /**
   *
   */
  hookPrevStep() {}

  /**
   *
   */
  hookNextStep() {}

  /**
   *
   */
  hookPreFirstStep() {}

  /**
   *
   */
  hookPreLastStep() {}


  /**
   *
   */
  hookSetStep() {}

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
      this[master] = require(
        path.join(this.path, master, 'index.js')
      );
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

exports.masters = new LoadMasters();
exports.MasterOfMasters = MasterOfMasters;
exports.loadMaster = loadMaster;
exports.LoadMasters = LoadMasters;
