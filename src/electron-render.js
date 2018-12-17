/**
 * @file Render process, assemble all submodules, bootstrap
 * configuration and run render process
 */

/* global HTMLElement location customElements search */

const path = require('path')

const jquery = require('jquery')
const mousetrap = require('mousetrap')
require('selectize')

let modalManager

const song = require('./src/song.js')
const { bootstrapConfig, Library } = require('./src/without-dom.js')

/**
 * Map some keyboard shortcuts to the corresponding methods.
 */
function bindShortcuts () {
  mousetrap.bind('esc', function () { modalManager.toggleByID('search') })
  mousetrap.bind('alt', function () { modalManager.toggleByID('tableofcontents') })
  mousetrap.bind('left', song.previousSlide)
  mousetrap.bind('right', song.nextSlide)
}

/**
 * Map some buttons to the corresponding methods.
 */
function bindButtons () {
  let bindings = [
    { selector: '#menu #menu-search', function: () => { modalManager.openByID('search') } },
    { selector: '#menu #menu-tableofcontents', function: () => { modalManager.openByID('tableofcontents') } },
    { selector: '#slide #previous', function: song.previousSlide },
    { selector: '#slide #next', function: song.nextSlide }
  ]
  for (let binding of bindings) {
    document
      .querySelector(binding.selector)
      .addEventListener('click', binding.function)
  }
}

var showByHash = function () {
  if (location.hash === '#search') {
    modalManager.openByID('search')
  } else if (location.hash === '#tableofcontents') {
    modalManager.openByID('tableofcontents')
  } else if (location.hash) {
    song.loadByHash()
  } else {
    modalManager.openByID('search')
  }
}

/**
 * Generate a tree view for the table of contents page.
 */
class BaldrSongbookToc extends HTMLElement {
  constructor () {
    super()
    let topUl = document.createElement('ul')

    Object.keys(library.tree).forEach((abc, index) => {
      let abcLi = document.createElement('li')
      abcLi.setAttribute('class', 'abc')
      abcLi.innerHTML = abc

      let abcUl = document.createElement('ul')

      Object.keys(library.tree[abc]).forEach((folder, index) => {
        let li = document.createElement('li')
        let a = document.createElement('a')
        a.setAttribute('href', '#' + folder)
        a.setAttribute('id', 'song_' + folder)
        a.innerHTML = library.tree[abc][folder].title
        li.appendChild(a)
        abcUl.appendChild(li)
      })
      topUl.appendChild(abcLi)
      abcLi.appendChild(abcUl)
    })
    this.appendChild(topUl)
  }
}

/**
 * Build the drop down menu for selectize
 */
class BaldrSongbookSearch extends HTMLElement {
  constructor () {
    super()

    let select = document.createElement('select')
    select.setAttribute('id', 'select')
    select.setAttribute('placeholder', 'Suche nach einem Lied')

    let option = document.createElement('option')
    option.setAttribute('value', '')
    select.appendChild(option)

    for (let songID in library.list) {
      option = document.createElement('option')
      option.setAttribute('value', songID)
      option.innerHTML = library.list[songID].title
      select.appendChild(option)
    }
    this.appendChild(select)
  }
}

/**
 * Build the drop down menu for selectize
 */
class BaldrSongbookModal extends HTMLElement {
  constructor () {
    super()
    let elmementClose = document.createElement('div')
    elmementClose.addEventListener('click', () => { this.close() })
    elmementClose.classList.add('close', 'button', 'fa', 'fa-times')
    if (this.hasAttribute('title')) {
      let elementH2 = document.createElement('h2')
      elementH2.innerHTML = this.getAttribute('title')
      this.prepend(elementH2)
    }
    this.prepend(elmementClose)
    this.style.display = 'none'
  }

  close () {
    this.style.display = 'none'
  }

  get isOpen () {
    if (this.style.display === 'none') {
      return false
    } else if (this.style.display === 'block') {
      return true
    }
  }

  open () {
    this.style.display = 'block'
  }

  toggle () {
    if (this.style.display === 'none') {
      this.style.display = 'block'
    } else {
      this.style.display = 'none'
    }
  }
}

/**
 * Manage all modal windows of a app.
 */
class ModalManager {
  constructor () {
    let modals = document.querySelectorAll('baldr-songbook-modal')
    this.modals = {}
    for (let modal of modals) {
      this.modals[modal.id] = modal
    }
  }

  toggleByID (modalID) {
    this.modals[modalID].open()
  }

  closeAll () {
    for (let modalID in this.modals) {
      this.modals[modalID].close()
    }
  }

  openByID (modalID) {
    for (let id in this.modals) {
      let modal = this.modals[id]
      if (modal.id === modalID) {
        modal.open()
      } else {
        modal.close()
      }
    }
  }
}

const config = bootstrapConfig()

const library = new Library(path.join(config.path, 'songs.json'))

var main = function () {
  customElements.define('baldr-songbook-search', BaldrSongbookSearch)
  customElements.define('baldr-songbook-toc', BaldrSongbookToc)
  customElements.define('baldr-songbook-modal', BaldrSongbookModal)

  modalManager = new ModalManager()

  song.set({
    'library': library.list,
    'selector': '#slide img',
    'songsPath': config.path
  })

  bindButtons()

  window.onhashchange = showByHash

  bindShortcuts()

  var selectized = jquery('select').selectize({
    onItemAdd: function (value, data) {
      song.setCurrent(value)
      modalManager.closeAll()
    }
  })
  search.selectize = selectized[0].selectize
  search.selectize.focus()

  showByHash()
}

if (config.path) {
  main()
}
