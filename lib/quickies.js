/**
 * @file
 * @module lib/quickies
 */

class Quickies {

  constructor(document) {

    /**
     *
     */
    this.document = document;

    /**
     *
     */
    this.elemNavigationMenu = this.document.getElementById('nav-quickies');

    /**
     *
     */
    this.defaultQuickies = [
      {
        title: 'Camera',
        master: 'camera',
        shortcut: 'ctrl+c',
        fontawesome: ''
      },
      {
        title: 'Editor',
        master: 'editor',
        shortcut: '',
        fontawesome: ''
      },
      {
        title: 'Audio',
        master: 'audio',
        shortcut: '',
        fontawesome: ''
      },
      {
        title: 'Video',
        master: 'video',
        shortcut: '',
        fontawesome: ''
      },
      {
        title: 'Image',
        master: 'image',
        shortcut: '',
        fontawesome: ''
      },
      {
        title: 'Google',
        master: 'website',
        data: 'https://google.com',
        shortcut: '',
        fontawesome: ''
      },
      {
        title: 'Wikipedia',
        master: 'website',
        data: 'https://en.wikipedia.org',
        shortcut: '',
        fontawesome: ''
      }
    ];

  }

  /**
   *
   */
  renderNavigationMenu() {

  }
}
