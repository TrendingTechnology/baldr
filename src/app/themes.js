/**
 * @file Gather informations about all themes.
 * @module baldr-application/themes
 */

'use strict';

const fs = require('fs');
const path = require('path');
const {addCSSFile} = require('baldr-library');

/**
 * Gather informations about all themes.
 */
class Themes {

  /**
   * @param {object} document The document object of the browser (DOM), see on MDN:
   * {@link https://developer.mozilla.org/en-US/docs/Web/API/Document Document}
   */
  constructor(document) {

    /**
     * The document object of the browser (DOM), see on MDN:
     * {@link https://developer.mozilla.org/en-US/docs/Web/API/Document Document}
     * @type {object}
     */
    this.document = document;

    /**
     * Parent path of all themes.
     * @type {string}
     */
     this.path = path.join(__dirname, '..', '..', 'themes');

    /**
     * Folder names of all themes
     * @type {array}
     */
    this.all = this.getThemes();

  }

  /**
   * Get the folders of all themes.
   * @return {array} Folder names of all themes
   */
  getThemes() {
    return fs.readdirSync(this.path, 'utf8')
      .filter(
        dir => fs.statSync(
          path.join(this.path, dir)
        ).isDirectory()
      );
  }

  /**
   * Resolve all theme dependencies (e. g. typeface modules)
   *
   * @param {object} dependencies The dependencies object like in
   * package.json
   * @return {array} A list of CSS paths as an array
   */
  resolveDependencies(dependencies) {
    return Object.keys(dependencies)
      .map(
        dependency => require.resolve(dependency)
      );
  }

  /**
   * Resolve the folder path of the theme module
   *
   * @param {string} name The name of the theme
   * @return {string} Absolute path of the folder containing the theme
   * module.s
   */
  resolveTheme(name) {
    return path.dirname(
      require.resolve('baldr-theme-' + name)
    );
  }

  /**
   * Get the content of the package.json file.
   *
   * @param {string} name The name of the theme
   */
  getPackageJSON(name) {
    return require(
      path.join(this.resolveTheme(name), 'package.json')
    );
  }

  /**
   * @return {array} A array of CSS files in the order: first
   * dependencies of the theme and then the real theme CSS file
   */
  getAllCSSFiles() {
    let pkg;
    let dependencies;
    let cssFiles = [];
    for (let name of this.all) {
      pkg = this.getPackageJSON(name);
      dependencies = this.resolveDependencies(pkg.dependencies);
      for (let dependencyCSS of dependencies) {
        cssFiles.push(dependencyCSS);
      }
      cssFiles.push(require.resolve('baldr-theme-' + name));
    }
    return cssFiles;
  }

  /**
   * Load all CSS files of all themes and add link elements to the
   * DOM.
   */
  loadThemes() {
    for (let cssFile of this.getAllCSSFiles()) {
      addCSSFile(this.document, cssFile, 'baldr-theme');
    }
  }

  /**
   * Set a data-* attribute to the body element of the DOM.
   *
   * @param {string} name The name of the theme
   */
  setTheme(name) {
    this.document.body.dataset.theme = name;
  }

}

/**
 * @param {object} document The document object of the browser (DOM), see on MDN:
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/Document Document}
 */
exports.getThemes = function(document) {
  let themes = new Themes(document);
  themes.loadThemes();
  return themes;
};
