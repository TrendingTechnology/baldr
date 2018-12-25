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
  static get observedAttributes () {
    return ['songid', 'no']
  }

  constructor () {
    super()
    const shadowRoot = this.attachShadow({ mode: 'open' })

    let styleElement = document.createElement('style')
    styleElement.innerHTML = `
      div {
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
    `
    shadowRoot.appendChild(styleElement)

    let divElement = document.createElement('div')
    shadowRoot.appendChild(divElement)

    /**
     *
     */
    this.imgElement = document.createElement('img')
    divElement.appendChild(this.imgElement)

    // /**
    //  *
    //  */
    // let setSongTitle = function () {
    //   if (slideNumber === 0 && song.hasOwnProperty('title')) {
    //     document.getElementById('song-title').style.display = 'block'
    //     document.getElementById('song-title_title').textContent = song.title
    //     document.getElementById('song-title_subtitle').textContent = song.subtitle
    //   } else {
    //     document.getElementById('song-title').style.display = 'none'
    //   }
    // }

    // <section id="slide">
    //   <div id="song-title">
    //     <h1 id="song-title_title"></h1>
    //     <h2 id="song-title_subtitle"></h2>
    //   </div>
    //   <img>
    //   <ul>
    //     <li id="previous" class="button fa fa-arrow-left" title="Vorhergehende Seite (Tastenkürzel: linke Pfeiltaste)"></li>
    //     <li id="next" class="button fa fa-arrow-right" title="Nächste Seite (Tastenkürzel: rechte Pfeiltaste)"></li>
    //   </ul>
    // </section>

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
      this.setSongById(newValue)
    } else if (name === 'no') {
      this.setSlideByNo_(newValue)
    }
  }

  setSongById (songID) {
    this.song = library.getSongById(songID)
    this.songid_ = songID
    this.setSlideByNo_(1)
  }

  setSongByHash (hash) {
    if (hash !== '') {
      this.setSongById(hash.substring(1))
    }
  }

  setSlideByNo_ (no) {
    this.imgElement.setAttribute('src', path.join(this.song.folderSlides.get(), this.song.slidesFiles[no - 1]))
  }

  get no () {
    return this.no_
  }

  set no (value) {
    this.no_ = value
    this.setAttribute('no', value)
  }

  get songid () {
    return this.songid_
  }

  set songid (value) {
    this.songid_ = value
    this.setAttribute('songid', value)
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
    this.setSlideByNo_(this.no)
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
    this.setSlideByNo_(this.no)
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

/**
 *
 * @param {*} mapping
 */
function defineCustomElements (mapping) {
  for (let element of arguments) {
    customElements.define(element[0], element[1])
  }
}

let main = function () {
  defineCustomElements(
    ['baldr-songbook-search', BaldrSongbookSearch],
    ['baldr-songbook-toc', BaldrSongbookToc],
    ['baldr-songbook-modal', BaldrSongbookModal],
    ['baldr-songbook-song-slide', BaldrSongbookSongSlide]
  )

  songSlide = document.querySelector('baldr-songbook-song-slide')
  modalManager = new ModalManager()

  bindButtons(
    [ '#menu #menu-search', () => { modalManager.openByID('search') } ],
    [ '#menu #menu-tableofcontents', () => { modalManager.openByID('tableofcontents') } ]
    // { selector: '#slide #previous', function: song.previousSlide },
    // { selector: '#slide #next', function: song.nextSlide }
  )

  window.onhashchange = showByHash

  bindShortcuts({
    'left': function () { songSlide.previous() },
    'right': function () { songSlide.next() },
    'esc': function () { modalManager.toggleByID('search') },
    'alt': function () { modalManager.toggleByID('tableofcontents') }
  })

  let selectized = jquery('select').selectize({
    onItemAdd: function (value) {
      songSlide.setAttribute('songid', value)
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
