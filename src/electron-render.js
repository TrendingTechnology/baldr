/**
 * @file Render process, assemble all submodules, bootstrap
 * configuration and run render process
 */

/* global HTMLElement location customElements search */

const jquery = require('jquery')
const mousetrap = require('mousetrap')
const path = require('path')

require('selectize')

let modalManager

const song = require('./src/song.js')
const { bootstrapConfig, Library, AlphabeticalSongsTree } = require('./src/lib.js')

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
    { selector: '#menu #menu-tableofcontents', function: () => { modalManager.openByID('tableofcontents') } }
    // { selector: '#slide #previous', function: song.previousSlide },
    // { selector: '#slide #next', function: song.nextSlide }
  ]
  for (let binding of bindings) {
    document
      .querySelector(binding.selector)
      .addEventListener('click', binding.function)
  }
}

let showByHash = function () {
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

    let tree = new AlphabeticalSongsTree(library.toArray())

    Object.keys(tree).forEach((abc) => {
      let abcLi = document.createElement('li')
      abcLi.setAttribute('class', 'abc')
      abcLi.innerHTML = abc

      let abcUl = document.createElement('ul')

      for (let song of tree[abc]) {
        let li = document.createElement('li')
        let a = document.createElement('a')
        a.setAttribute('href', '#' + song.songID)
        a.setAttribute('id', 'song_' + song.songID)
        a.innerHTML = song.metaDataCombined.title
        li.appendChild(a)
        abcUl.appendChild(li)
      }

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

    for (let songID in library.songs) {
      let song = library.songs[songID]
      option = document.createElement('option')
      option.setAttribute('value', songID)
      option.innerHTML = song.metaDataCombined.title
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
 *
 */
class BaldrSongbookSongSlide extends HTMLElement {
  static get observedAttributes() {
    return ['songid', 'no']
  }

  constructor () {
    super()
    const shadowRoot = this.attachShadow({mode: 'open'})

    /**
     *
     */
    this.imgElement = document.createElement('img')
    shadowRoot.appendChild(this.imgElement)

    /**
     * The current slide number.
     */
    this.song

    /**
     * The current slide number.
     */
    this.no = 1
  }

  attributeChangedCallback (name, oldValue, newValue) {
    if (name === 'songid') {
      this.setSongById_(newValue)
    } else if (name === 'no') {
      this.setSlideByNo_(newValue)
    }
  }

  setSongById_ (songID) {
    this.song = library.getSongById(songID)
  }

  setSlideByNo_ (no) {
    this.imgElement.setAttribute('src', path.join(this.song.folderSlides.get(), this.song.slidesFiles[no - 1]))
  }

  /**
   * Show the next slide.
   */
  next () {
    this.no += 1
    if (this.no >= this.song.slidesFiles.length) {
      this.no = 1
    }
    setSlideByNo_(this.no)
  }

  /**
   * Show the previous slide.
   */
  previous () {
    this.no -= 1
    if (this.no < 0) {
      this.no = this.song.slidesFiles.length
    }
    setSlideByNo_(this.no)
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

const library = new Library(config.path)

let main = function () {
  customElements.define('baldr-songbook-search', BaldrSongbookSearch)
  customElements.define('baldr-songbook-toc', BaldrSongbookToc)
  customElements.define('baldr-songbook-modal', BaldrSongbookModal)
  customElements.define('baldr-songbook-song-slide', BaldrSongbookSongSlide)

  modalManager = new ModalManager()

  song.set({
    'library': library.list,
    'selector': '#slide img',
    'songsPath': config.path
  })

  bindButtons()

  window.onhashchange = showByHash

  bindShortcuts()

  let selectized = jquery('select').selectize({
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
