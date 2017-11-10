/**
 * @file Gather informations about all themes.
 * @module lib/themes
 */

const fs = require('fs');
const path = require('path');

/**
 * Gather informations about all themes.
 */
class Themes {

  /**
   * @constructor
   */
  constructor() {

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
   * Load all CSS files of all themes and add link elements to the
   * DOM.
   */
  loadThemes() {

  }

  /**
   * Set a data-* attribute to the body element of the DOM.
   *
   * @param {string} name The name of the theme
   */
  setTheme() {

  }

}

exports.Themes = Themes;
