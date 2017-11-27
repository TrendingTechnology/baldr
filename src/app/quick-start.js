/**
 * @file
 * @module baldr-application
 */

'use strict';

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
      entries = entries.concat(
        this.masters[master].quickStartEntries()
      );
    }
    return entries;
  }

  /**
   *
   */
  renderButton(title, fontawesome) {
    let button = this.document.createElement('button');
    button.title = title;
    button.classList.add('fa');
    button.classList.add('fa-' + fontawesome);
    return button;
  }

  /**
   *
   */
  renderNavigationMenu() {
    for (let entry of this.entries) {
      let button = this.renderButton(entry.title, entry.fontawesome);
      this.elemNavigationMenu.appendChild(button);
    }
  }

  set() {
    this.renderNavigationMenu();
  }
}

exports.QuickStart = QuickStart;

exports.getQuickStart = function(document, masters) {
  return new QuickStart(document, masters);
};
