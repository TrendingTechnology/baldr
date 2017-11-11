/**
 * @file Gather informations about all themes.
 * @module lib/themes
 */

'use strict';

const fs = require('fs');
const path = require('path');
const state = require('../lib/state.js');

/**
 * Gather informations about all themes.
 */
class Themes {

  /**
   * @constructor
   */
  constructor(document) {

    this.document = document;

    /**
     * Parent path of all themes.
     * @type {string}
     */
     this.path = path.join(__dirname, '..', 'themes');

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
    let link;
    for (let cssFile of this.getAllCSSFiles()) {
      let link = this.document.createElement('link');
      link.rel = 'stylesheet';
      link.type = 'text/css';
      link.classList.add('baldr-theme');
      link.href = cssFile;
      this.document.head.appendChild(link);
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

exports.Themes = Themes;
