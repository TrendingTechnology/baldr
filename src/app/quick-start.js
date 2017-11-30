/**
 * @file
 * @module baldr-application/quick-start
 */

/* jshint -W083 */

'use strict';

const {checkProperty} = require('baldr-library');

/**
 * A array of [raw quick start entries]{@link module:baldr-application/quick-start~rawQuickStartEntry}
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

/***********************************************************************
 *
 **********************************************************************/

/**
 * The processed quick start entry object.
 */
class QuickStartEntry {

  /**
   *
   */
  constructor(rawQuickStartEntry, master, no) {

    /**
     * @type {integer}
     */
    this.no = no;

    /**
     * CSS id name like “quick-start-entry_master_1”
     * @type {string}
     */
    this.cssID = 'quick-start-entry_' + master +  '_' + no;

    /**
     * Slide data
     * @type {string|array|object}
     */
    this.data = rawQuickStartEntry.data;

    /**
     * Name of a fontawesome icon
     * @type {string}
     */
    this.fontawesome = rawQuickStartEntry.fontawesome;

    /**
     * Name of the master
     * @type {master}
     */
    this.master = master;

    /**
     * Mousetrap shortcut string
     * @type {string}
     */
    this.shortcut = rawQuickStartEntry.shortcut;

    /**
     * String to show in the “title” attribute of the HTML link tag.
     * @type {string}
     */
    this.title = rawQuickStartEntry.title;
  }
}

/***********************************************************************
 *
 **********************************************************************/

/**
 *
 */
class QuickStart {

  /**
   *
   */
  constructor(document, masters, config) {

    this.config = config;

    this.masters = masters;

    /**
     * {@link https://developer.mozilla.org/en-US/docs/Web/API/Document Document}
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
    this.entries = this.collectEntries_();
  }

  /**
   * @return {array} Array of [quick start entries]{@link module:baldr-application/quick-start~QuickStartEntry}.
   */
  collectEntries_() {
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

    let out = [];
    for (let index in entries) {
      let no = Number.parseInt(index) + 1;
      out.push(new QuickStartEntry(entries[index], entries[index].master, no));
    }

    return out;
  }

  /**
   * @param {module:baldr-application/quick-start~quickStartEntry} entry
   *
   * @return {object} {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLButtonElement HTMLButtonElement}
   */
  renderButton_(entry) {
    let button = this.document.createElement('button');
    let shortcut = '';
    if (checkProperty.isString(entry, 'shortcut')) {
      shortcut = ` (${entry.shortcut})`;
    }
    button.title = `${entry.title}${shortcut}`;
    button.id = entry.cssID;
    button.classList.add('fa');
    button.classList.add('fa-' + entry.fontawesome);
    return button;
  }

  /**
   *
   */
  renderNavigationMenu_() {
    for (let entry of this.entries) {
      let button = this.renderButton_(entry);
      this.elemNavigationMenu.appendChild(button);
    }
  }

  /**
   *
   */
  set() {
    this.renderNavigationMenu_();
  }

  /**
   *
   */
  bind(showRunner, mousetrap) {
    for (let entry of this.entries) {
      let func = () => {
        showRunner.setInstantSlide(
          entry.master,
          entry.data,
          this.document,
          this.config,
          this.masters
        );
      };
      // To allow unit tests without window object.
      // mousetrap returns in this situation an empty object.
      if (mousetrap && mousetrap.hasOwnProperty('bind')) {
        mousetrap.bind(entry.shortcut, func);
      }
      this.document
      .getElementById(entry.cssID)
      .addEventListener('click', func);
    }
  }
}

/**
 *
 */
exports.getQuickStart = function(document, masters) {
  return new QuickStart(document, masters);
};

exports.QuickStart = QuickStart;
