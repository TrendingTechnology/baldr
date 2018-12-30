/**
 * @file
 * @module @bldr/electron-app/quick-start
 */

/* jshint -W083 */

'use strict'

const { checkProperty } = require('@bldr/library')

/**
 * A array of [raw quick start entries]{@link module:@bldr/electron-app/quick-start~rawQuickStartEntry}
 * @typedef rawQuickStartEntries
 * @type {array}
 */

/**
 * A raw quick start entry specified in the master slide hooks.
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
 * An array of processed [quick start entries]{@link module:@bldr/electron-app/quick-start~quickStartEntry}
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
   * @param {module:@bldr/electron-app/quick-start~rawQuickStartEntry} rawQuickStartEntry
   *   A raw quick start entry specified in the master slide hooks.
   * @param {string} masterName Name of the master slide.
   * @param {integer} no A integer starting from 1
   */
  constructor (rawQuickStartEntry, masterName, no) {
    /**
     *  A integer starting from 1
     * @type {integer}
     */
    this.no = no

    /**
     * CSS id name like “quick-start-entry_master_1”
     * @type {string}
     */
    this.cssID = 'quick-start-entry_' + masterName + '_' + no

    /**
     * Slide data
     * @type {string|array|object}
     */
    this.data = rawQuickStartEntry.data

    /**
     * Name of a fontawesome icon
     * @type {string}
     */
    this.fontawesome = rawQuickStartEntry.fontawesome

    /**
     * The name of the master
     * @type {master}
     */
    this.masterName = masterName

    /**
     * Mousetrap shortcut string
     * @type {string}
     */
    this.shortcut = rawQuickStartEntry.shortcut

    /**
     * String to show in the “title” attribute of the HTML link tag.
     * @type {string}
     */
    this.title = rawQuickStartEntry.title
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
   * @param {module:@bldr/electron-app~Environment} env Low level
   *   environment data.
   */
  constructor (env) {
    /**
     * Low level environment data.
     * @type {module:@bldr/electron-app~Environment}
     */
    this.env = env

    /**
     *
     */
    this.elemNavigationMenu = this.env.document.getElementById('nav-quick-start')

    /**
     * @type {module:@bldr/electron-app/quick-start~quickStartEntries}
     */
    this.entries = this.collectEntries_()
  }

  /**
   * @return {array} Array of [quick start entries]{@link module:@bldr/electron-app/quick-start~QuickStartEntry}.
   */
  collectEntries_ () {
    let entries = []
    for (let masterName of this.env.masters.all) {
      let rawEntries = this.env.masters[masterName].quickStartEntries()
      for (let index in rawEntries) {
        rawEntries[index].masterName = masterName
        if (!rawEntries[index].hasOwnProperty('data')) {
          rawEntries[index].data = true
        }
      }
      entries = entries.concat(rawEntries)
    }

    let out = []
    for (let index in entries) {
      let no = Number.parseInt(index) + 1
      out.push(new QuickStartEntry(entries[index], entries[index].masterName, no))
    }

    return out
  }

  /**
   * @param {module:@bldr/electron-app/quick-start~quickStartEntry} entry
   *
   * @return {object} {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLButtonElement HTMLButtonElement}
   */
  renderButton_ (entry) {
    let button = this.env.document.createElement('button')
    let shortcut = ''
    if (checkProperty.isString(entry, 'shortcut')) {
      shortcut = ` (${entry.shortcut})`
    }
    button.title = `${entry.title}${shortcut}`
    button.id = entry.cssID
    button.classList.add('fa')
    button.classList.add('fa-' + entry.fontawesome)
    return button
  }

  /**
   *
   */
  renderNavigationMenu_ () {
    for (let entry of this.entries) {
      let button = this.renderButton_(entry)
      this.elemNavigationMenu.appendChild(button)
    }
  }

  /**
   *
   */
  set () {
    this.renderNavigationMenu_()
  }

  /**
   *
   */
  bind (showRunner, mousetrap) {
    for (let entry of this.entries) {
      let func = () => {
        showRunner.setInstantSlide(
          entry.masterName,
          entry.data,
          this.env
        )
      }
      // To allow unit tests without window object.
      // mousetrap returns in this situation an empty object.
      if (mousetrap && mousetrap.hasOwnProperty('bind')) {
        mousetrap.bind(entry.shortcut, func)
      }
      this.env.document
        .getElementById(entry.cssID)
        .addEventListener('click', func)
    }
  }
}

/**
 *
 */
exports.getQuickStart = function (env) {
  return new QuickStart(env)
}

exports.QuickStart = QuickStart
