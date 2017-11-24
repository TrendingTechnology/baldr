/**
 * @file Gather informations about all available master slides
 * @module baldr-masters
 */

const fs = require('fs');
const path = require('path');

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

exports.getMasters = function() {
  return new LoadMasters();
};
