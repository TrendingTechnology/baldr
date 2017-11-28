/**
 * @file
 * @module baldr-application/quick-start
 */

/* jshint -W083 */

'use strict';

/**
 * @typedef rawQuickStartEntries
 * @type {array}
 */

/**
 * @typedef rawQuickStartEntry
 * @type {object}
 * @property {title} title String to show in the “title” attribute of
 *   the HTML link tag.
 * @property {string|array|object} data Slide data
 * @property {string} shortcut Mousetrap shortcut string
 * @property {string} fontawesome Name of a fontawesome icon
 *   (without “fa-”).
 */

/**
 * An array of processed [quick start entries]{@link module:baldr-application/quick-start~quickStartEntry}
 *
 * @typedef quickStartEntries
 * @type {array}
 */

/**
 * The processed quick start entry object.
 *
 * @typedef quickStartEntry
 * @type {object}
 * @property {string} cssID CSS id name like “quick-start-entry_master_1”
 * @property {string|array|object} data Slide data
 * @property {string} fontawesome Name of a fontawesome icon
 *   (without “fa-”).
 * @property {string} master Name of the master
 * @property {string} shortcut Mousetrap shortcut string
 * @property {title} title String to show in the “title” attribute of
 *   the HTML link tag.
 */

/**
 *
 */
class QuickStart {

  constructor(document, masters) {
    this.masters = masters;

    /**
     * {@link https://developer.mozilla.org/en-US/docs/Web/API/Document}
     *
     * @type {object}
     */
    this.document = document;

    /**
     *
     */
    this.elemNavigationMenu = this.document.getElementById('nav-quick-start');

    /**
     * @type {module:baldr-application/quick-start~quickStartEntries}
     */
    this.entries = this.collectEntries();
  }

  /**
   * @return {array} Array of [quick start entries]{@link module:baldr-application/quick-start~quickStartEntry}.
   */
  collectEntries() {
    let entries = [];
    for (let master of this.masters.all) {
      let rawEntries = this.masters[master].quickStartEntries();
      for (let index in rawEntries) {
        rawEntries[index].master = master;
        if (!rawEntries[index].hasOwnProperty('data')) {
          rawEntries[index].data = true;
        }
      }
      entries = entries.concat(rawEntries);
    }

    for (let index in entries) {
      let no = Number.parseInt(index) + 1;
      entries[index].cssID =
        'quick-start-entry_' + entries[index].master +  '_' + no;
    }

    return entries;
  }

  /**
   *
   */
  renderButton(entry) {
    let button = this.document.createElement('button');
    button.title = entry.title;
    button.id = entry.cssID;
    button.classList.add('fa');
    button.classList.add('fa-' + entry.fontawesome);
    return button;
  }

  /**
   *
   */
  renderNavigationMenu() {
    for (let entry of this.entries) {
      let button = this.renderButton(entry);
      this.elemNavigationMenu.appendChild(button);
    }
  }

  /**
   *
   */
  set() {
    this.renderNavigationMenu();
  }

  /**
   *
   */
  bind(showRunner, mousetrap) {
    for (let entry of this.entries) {
      let func = function() {
        showRunner.setInstantSlide(entry.master, entry.data);
      };
      mousetrap.bind(entry.shortcut, func);
      this.document
      .getElementById(entry.cssID)
      .addEventListener('click', func);
    }
  }
}

exports.QuickStart = QuickStart;

/**
 *
 */
exports.getQuickStart = function(document, masters) {
  return new QuickStart(document, masters);
};
