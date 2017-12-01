/**
 * @file Gather informations about all themes.
 * @module baldr-application/themes
 */

'use strict';

const fs = require('fs');
const path = require('path');
const {addCSSFile} = require('baldr-library');

/***********************************************************************
 *
 **********************************************************************/

/**
 * Gather informations about all themes.
 */
class Themes {

  /**
   * @param {module:baldr-application~Document} document The document
   *   object of the browser (DOM).
   */
  constructor(document) {

    /**
     * The document object of the browser (DOM).
     * @type {module:baldr-application~Document}
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
    this.all = this.getThemes_();

  }

  /**
   * Get the folders of all themes.
   * @return {array} Folder names of all themes
   */
  getThemes_() {
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
   *   package.json
   * @return {array} A list of CSS paths as an array
   */
  resolveDependencies_(dependencies) {
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
  resolveTheme_(name) {
    return path.dirname(
      require.resolve('baldr-theme-' + name)
    );
  }

  /**
   * Get the content of the package.json file.
   *
   * @param {string} name The name of the theme
   */
  getPackageJSON_(name) {
    return require(
      path.join(this.resolveTheme_(name), 'package.json')
    );
  }

  /**
   * @return {array} A array of CSS files in the order: first
   * dependencies of the theme and then the real theme CSS file
   */
  getAllCSSFiles_() {
    let pkg;
    let dependencies;
    let cssFiles = [];
    for (let name of this.all) {
      pkg = this.getPackageJSON_(name);
      dependencies = this.resolveDependencies_(pkg.dependencies);
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
    for (let cssFile of this.getAllCSSFiles_()) {
      addCSSFile(this.document, cssFile, 'baldr-theme');
    }
  }

}

/***********************************************************************
 *
 **********************************************************************/

/**
 * @param {module:baldr-application~Document} document The document
 *   object of the browser (DOM).
 */
exports.getThemes = function(document) {
  let themes = new Themes(document);
  themes.loadThemes();
  return themes;
};
