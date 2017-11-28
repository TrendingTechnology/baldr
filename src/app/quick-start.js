/**
 * @file
 * @module baldr-application/quick-start
 */

/* jshint -W083 */

'use strict';

/**
 *
 */
class QuickStart {

  constructor(document, masters) {
    this.masters = masters;

    /**
     *
     */
    this.document = document;

    /**
     *
     */
    this.elemNavigationMenu = this.document.getElementById('nav-quick-start');

    this.entries = this.collectEntries();
  }

  /**
   *
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
