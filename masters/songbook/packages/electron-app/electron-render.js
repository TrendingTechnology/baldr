/**
 * @file Render process, assemble all submodules, bootstrap
 * configuration and run render process
 */

/* global HTMLElement location customElements */

// Node packages.
const path = require('path')

// Third party packages.
const jquery = require('jquery')
const mousetrap = require('mousetrap')
require('selectize')
const electron = require('electron')

// Project packages.
const { bootstrapConfig, Library, AlphabeticalSongsTree } = require('@bldr/songbook-base')

const config = bootstrapConfig()
const library = new Library(config.path)
let modalManager
let songSlide
let selectized

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

/**
 * Show elements of the electron on hash change.
 */
function showByHash () {
  if (location.hash === '#search') {
    modalManager.openByID('search')
  } else if (location.hash === '#tableofcontents') {
    modalManager.openByID('tableofcontents')
  } else if (location.hash) {
    songSlide.setSongByHash(location.hash)
    library.updateCurrentSongIndex(location.hash.substring(1))
    modalManager.closeAll()
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
    let tree = new AlphabeticalSongsTree(library.toArray())
    let outABC = ''
    Object.keys(tree).forEach((abc) => {
      outABC += this.templateABC(tree, abc)
    })
    this.innerHTML = `
    <section>
      <style type="text/css">
        #tableofcontents section {
          display: block;
          overflow-y: scroll;
          height: 90%;
        }

        #tableofcontents .icon {
          height: 1em;
          width: 1em;
          display: inline-block;
        }

        .icon-musescore {
          background: url('icons/musescore.svg') left center no-repeat;
        }

        .icon-youtube {
          background: url('icons/youtube.svg') left center no-repeat;
        }
      </style>
      <ul>${outABC}</ul>
    </section>`

    this.bindExternalLinks(this)
  }

  /**
   * Open external links in the browser.
   *
   * @see {@link https://gist.github.com/luizcarraro/2d04d83e66e3f03bef9b2e714ea8c0d7#gistcomment-2819880}
   *
   * @param {HTMLUListElement} topUl
   */
  bindExternalLinks (topUl) {
    const aAll = topUl.querySelectorAll('a.icon')
    if (aAll && aAll.length) {
      aAll.forEach((a) => {
        a.addEventListener('click', (event) => {
          if (event.target) {
            event.preventDefault()
            electron.shell.openExternal(event.target.href)
          }
        })
      })
    }
  }

  /**
   * Generate the table of contents listings of songs in the same
   * alphabetical category.
   *
   * @param {module:@bldr/songbook-base~AlphabeticalSongsTree} tree
   * @param {string} abc - Lowercase a b c etc
   *
   * @returns {string}
   */
  templateABC (tree, abc) {
    let outSongs = ''
    for (let song of tree[abc]) {
      outSongs += this.templateSong(song)
    }
    return `<li class="abc">${abc}
              <ul>${outSongs}</ul>
            </li>`
  }

  /**
   * Generate the HTML markup of one song in the table of contents hierarchial
   * list.
   *
   * @param {module:@bldr/songbook-base~Song} song - The song object
   *
   * @returns {string}
   */
  templateSong (song) {
    let out = '<li class="song">'
    out += `<a class="title" title="${song.songID}" href="#${song.songID}" id="song_${song.songID}">
      ${song.metaDataCombined.title}
    </a>`

    if (song.metaDataCombined.subtitle) out += ` <span class="subtitle">${song.metaDataCombined.subtitle}</span>`
    if (song.metaDataCombined.composer) out += ` <span class="composer">${song.metaDataCombined.composer}</span>`
    if (song.metaDataCombined.lyricist) out += ` <span class="lyricist">${song.metaDataCombined.lyricist}</span>`

    if (song.metaData.musescore) {
      out += ` <a class="icon icon-musescore" title="Musescore" href="${song.metaData.musescore}"></a>`
    }
    if (song.metaData.youtube) {
      out += ` <a class="icon icon-youtube" title="Youtube" href="https://youtu.be/${song.metaData.youtube}"></a>`
    }
    out += '</li>'
    return out
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
 * A modal window.
 *
 *     <modal-window title="title"></modal-window>
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

  /**
   * Close the modal window.
   */
  close () {
    this.style.display = 'none'
  }

  /**
   * Boolean indicates if the window is open.
   */
  get isOpen () {
    if (this.style.display === 'none') {
      return false
    } else if (this.style.display === 'block') {
      return true
    }
  }

  /**
   * Open the modal window.
   */
  open () {
    this.style.display = 'block'
  }

  /**
   * Toggle the modal window.
   */
  toggle () {
    if (this.style.display === 'none') {
      this.style.display = 'block'
    } else {
      this.style.display = 'none'
    }
  }
}

/**
 * The song slide element.
 *
 *     <song-slide no="1" song-id="Backwater-Blues"></song-slide>
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
        <style type="text/css">
          .metadata {
            padding-top: 0.2vw;
            position: absolute;
            width: 100%;
          }

          .people {
            display: flex;
            font-size: 2vh;
            padding: 5vw;
          }

          .people > div {
            flex: 1;
          }

          .composer {
            text-align: right;
          }

          .lyricist {
            text-align: left;
          }

          h1, h2 {
            font-family: 'Alegreya Sans' !important;
            margin: 1vh;
          }

          h1 {
            font-size: 5vh;
          }

          h2 {
            font-size: 3vh;
            font-style: italic;
          }

          section {
            max-width: 100%;
            max-height: 100%;
            text-align: center;
          }

          img {
            width: 100%;
            height: 100%;
            vertical-align: middle;
            background-color: white;
          }

          .slide-number {
            padding: 1vw;
            position: absolute;
            left: 0;
            bottom: 0;
            z-index: 1;
            font-size: 1vw;
            opacity: 0;
          }

          .fade-out {
            animation: fadeout 2s linear forwards;
          }

          @keyframes fadeout {
            0% { opacity: 1; }
            100% { opacity: 0; }
          }

          ul {
            bottom: 0;
            display: flex;
            height: 4vw;
            margin: 0;
            padding: 0;
            position: fixed;
            right: 0;
            width: 10vw;
            z-index: 2;
          }

          li {
            width: 4vw;
            height: 4vw;
            background-size: 100%;
            opacity: 0.1;
            display: block;
          }

          li:hover {
            opacity: 1 !important;
          }

          ul:hover li {
            opacity: 0.3;
          }

          .previous {
            background-image: url('icons/chevron-left.svg');
          }

          .next {
            background-image: url('icons/chevron-right.svg');
          }
        </style>
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

    /**
     * The image element.
     */
    this.imgElement = shadowRoot.querySelector('img')

    /**
     * The metadata block element.
     */
    this.metaDataBlockElement = shadowRoot.querySelector('.metadata')

    /**
     * The slide number element.
     */
    this.slideNumberElement = shadowRoot.querySelector('.slide-number')

    /**
     * An object of metadata elements.
     *
     * @type {object}
     */
    this.metaDataElements = {
      title: shadowRoot.querySelector('h1'),
      subtitle: shadowRoot.querySelector('h2'),
      composer: shadowRoot.querySelector('.composer'),
      lyricist: shadowRoot.querySelector('.lyricist')
    }

    /**
     * The song object
     *
     * @type {module:@bldr/songbook-base~Song}
     */
    this.song = {}

    /**
     * The current slide number. The lowest slide number is 1 not 0.
     */
    this.no = 1
  }

  /**
   *
   * @param {string} name - The name of the attribute.
   * @param {mixed} oldValue - The old value.
   * @param {mixed} newValue - The new value.
   */
  attributeChangedCallback (name, oldValue, newValue) {
    if (name === 'songid') {
      this.setSongByID_(newValue)
    } else if (name === 'no') {
      this.setSlideByNo_(newValue)
    }
  }

  /**
   * Set the metadata fields.
   */
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
   * Set a song.
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
    this.setNoViaAttr(1)
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

  /**
   * Set the song slide by number.
   *
   * @param {integer} no - A integer starting from 1.
   */
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

  /**
   * Set the song slide number through the attribute.
   *
   * @param {integer} no - A integer starting from 1.
   */
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

function setSongAfterSearch (songID) {
  songSlide.setSongidViaAttr(songID)
  library.updateCurrentSongIndex(songID)
  modalManager.closeAll()
}

function searchFocus () {
  selectized[0].selectize.focus()
  selectized[0].selectize.clear()
}

function newSearch () {
  modalManager.toggleByID('search')
  searchFocus()
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
    'esc': newSearch,
    'alt': function () { modalManager.toggleByID('tableofcontents') },
    'ctrl+left': setPreviousSong,
    'ctrl+right': setNextSong,
    'r': setRandomSong
  })
  selectized = jquery('select').selectize({
    onItemAdd: setSongAfterSearch
  })
  searchFocus()
  showByHash()
}

if (config.path) {
  main()
}
