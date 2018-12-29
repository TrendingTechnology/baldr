/**
 * @file Render process, assemble all submodules, bootstrap
 * configuration and run render process
 */

/* global HTMLElement location customElements search */

const jquery = require('jquery')
const mousetrap = require('mousetrap')
const path = require('path')
const { bootstrapConfig, Library, AlphabeticalSongsTree } = require('./src/lib.js')
require('selectize')

const config = bootstrapConfig()
const library = new Library(config.path)
let modalManager
let songSlide

/**
 * Map some keyboard shortcuts to the corresponding methods.
 */
function bindShortcuts (shortcuts) {
  for (let shortcut in shortcuts) {
    mousetrap.bind(shortcut, shortcuts[shortcut])
  }
}

/**
 * Map some buttons to the corresponding methods.
 */
function bindButtons (bindings) {
  for (let binding of arguments) {
    document
      .querySelector(binding[0])
      .addEventListener('click', binding[1])
  }
}

function showByHash () {
  if (location.hash === '#search') {
    modalManager.openByID('search')
  } else if (location.hash === '#tableofcontents') {
    modalManager.openByID('tableofcontents')
  } else if (location.hash) {
    songSlide.setSongByHash(location.hash)
  } else {
    modalManager.openByID('search')
  }
}

/**
 * Generate a tree view for the table of contents page.
 */
class TableOfContentsElement extends HTMLElement {
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
class SongbookSearchElement extends HTMLElement {
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
class ModalWindowElement extends HTMLElement {
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
class SongSlideElement extends HTMLElement {
  static get observedAttributes () {
    return ['songid', 'no']
  }

  constructor () {
    super()
    const shadowRoot = this.attachShadow({ mode: 'open' })

    shadowRoot.innerHTML = `
      <section>
        <link href="css/song-slide.css" rel="stylesheet" type="text/css">
        <div class="metadata">
          <h1></h1>
          <h2></h2>
          <div class="people">
            <div class="lyricist"></div>
            <div class="composer"></div>
          </div>
        </div>
        <img>
        <ul>
          <li class="previous" title="Vorhergehende Seite (Tastenkürzel: linke Pfeiltaste)"></li>
          <li class="next" title="Nächste Seite (Tastenkürzel: rechte Pfeiltaste)"></li>
        </ul>
        <div class="slide-number"></div>
      </section>`

    this.imgElement = shadowRoot.querySelector('img')
    this.metaDataBlockElement = shadowRoot.querySelector('.metadata')
    this.slideNumberElement = shadowRoot.querySelector('.slide-number')
    this.metaDataElements = {
      title: shadowRoot.querySelector('h1'),
      subtitle: shadowRoot.querySelector('h2'),
      composer: shadowRoot.querySelector('.composer'),
      lyricist: shadowRoot.querySelector('.lyricist')
    }

    /**
     * The song object
     * @type {module:baldr-songbook~lib.Song}
     */
    this.song = {}

    /**
     * The current slide number. The lowest slide number is 1 not 0.
     */
    this.no = 1
  }

  attributeChangedCallback (name, oldValue, newValue) {
    if (name === 'songid') {
      this.setSongByID_(newValue)
    } else if (name === 'no') {
      this.setSlideByNo_(newValue)
    }
  }

  setMetaData_ () {
    for (let property in this.metaDataElements) {
      if (this.song.metaDataCombined[property]) {
        this.metaDataElements[property].style.display = 'block'
        this.metaDataElements[property].innerHTML = this.song.metaDataCombined[property]
      } else {
        this.metaDataElements[property].style.display = 'none'
      }
    }
  }

  /**
   * Set a song
   *
   * @param {string} songID
   */
  setSongByID_ (songID) {
    this.song = library.getSongById(songID)
    this.setAttribute('no', 1)
    this.setMetaData_()
  }

  /**
   * Set a song by using it’s song ID.
   *
   * To avoid a endless recursive loop we don’t use the method `setSongByID_` directly.
   * Instead we change the HTML attribute to the right song ID.
   *
   * @param {string} songID
   */
  setSongidViaAttr (songID) {
    this.setAttribute('songid', songID)
    this.setNoViaAttr (1)
  }

  /**
   * The a song by using a hast string.
   *
   * @param {string} hash - The song ID prefix with `#`.
   */
  setSongByHash (hash) {
    if (hash !== '') {
      this.setSongByID_(hash.substring(1))
    }
  }

  setSlideByNo_ (no) {
    // Maybe no is a string
    if (parseInt(no) === 1) {
      this.metaDataBlockElement.style.display = 'block'
    } else {
      this.metaDataBlockElement.style.display = 'none'
    }
    this.imgElement.setAttribute('src', path.join(this.song.folderSlides.get(), this.song.slidesFiles[no - 1]))
    this.slideNumberElement.innerHTML = no

    this.slideNumberElement.classList.remove('fade-out')
    // Simply add and remove the class without timeout doesn’t work
    setTimeout(() => { this.slideNumberElement.classList.add('fade-out') }, 1)
  }

  setNoViaAttr (no) {
    this.setAttribute('no', no)
    this.no = no
  }

  /**
   * Show the next slide.
   */
  next () {
    if (this.no === this.song.slidesFiles.length) {
      this.no = 1
    } else {
      this.no += 1
    }
    this.setNoViaAttr(this.no)
  }

  /**
   * Show the previous slide.
   */
  previous () {
    if (this.no === 1) {
      this.no = this.song.slidesFiles.length
    } else {
      this.no -= 1
    }
    this.setNoViaAttr(this.no)
  }
}

/**
 * Manage all modal windows of a app.
 */
class ModalManager {
  constructor () {
    let modals = document.querySelectorAll('modal-window')
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

/**
 *
 * @param {*} mapping
 */
function defineCustomElements (mapping) {
  for (let element of arguments) {
    customElements.define(element[0], element[1])
  }
}

/**
 * Set the previous song in the list of songs.
 */
function setPreviousSong () {
  songSlide.setSongidViaAttr(library.getPreviousSong().songID)
}

/**
 * Set the next song in the list of songs.
 */
function setNextSong () {
  songSlide.setSongidViaAttr(library.getNextSong().songID)
}

/**
 * Set a random song.
 */
function setRandomSong () {
  songSlide.setSongidViaAttr(library.getRandomSong().songID)
}

/**
 * Main function to enter in the render process.
 */
let main = function () {
  defineCustomElements(
    ['songbook-search', SongbookSearchElement],
    ['table-of-contents', TableOfContentsElement],
    ['modal-window', ModalWindowElement],
    ['song-slide', SongSlideElement]
  )

  songSlide = document.querySelector('song-slide')
  modalManager = new ModalManager()

  bindButtons(
    [ '#menu #menu-search', () => { modalManager.openByID('search') } ],
    [ '#menu #menu-tableofcontents', () => { modalManager.openByID('tableofcontents') } ]
  )

  songSlide.shadowRoot.querySelector('.previous').addEventListener('click', () => { songSlide.previous() })
  songSlide.shadowRoot.querySelector('.next').addEventListener('click', () => { songSlide.next() })

  window.onhashchange = showByHash

  bindShortcuts({
    'left': function () { songSlide.previous() },
    'right': function () { songSlide.next() },
    'esc': function () { modalManager.toggleByID('search') },
    'alt': function () { modalManager.toggleByID('tableofcontents') },
    'ctrl+left': setPreviousSong,
    'ctrl+right': setNextSong,
    'r': setRandomSong
  })

  let selectized = jquery('select').selectize({
    onItemAdd: function (songID) {
      songSlide.setSongidViaAttr(songID)
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
