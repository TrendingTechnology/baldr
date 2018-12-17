/**
 * @file The current song
 */

/* global location */

const path = require('path')

/**
 * The current slide number.
 */
let slideNumber = 0

/**
 * The biggest slide number.
 */
let slideNumberMax

/**
 * Array of all images files of a song.
 */
let slides

/**
 * The absolute path of the song folder containing the images files.
 */
let folder

/**
 * Parent folder containing all songs
 */
let songsPath

/**
 * <code><pre>
 * {
 *   "Aint-she-sweet": {
 *     "title": "Ain’t she sweet",
 *     "artist": "Milton Ager (1893 - 1979)",
 *     "lyricist": "Jack Yellen",
 *     "folder": "/home/jf/git-repositories/content/lieder/a/Aint-she-sweet",
 *     "slides": [
 *       "01.svg",
 *       "02.svg"
 *     ]
 *   },
 *   "Altes-Fieber": {
 *     "title": "Altes Fieber",
 *     "artist": "Die Toten Hosen",
 *     "musescore": "https://musescore.com/user/12559861/scores/4801717",
 *     "folder": "/home/jf/git-repositories/content/lieder/a/Altes-Fieber",
 *     "slides": [
 *       "01.svg",
 *       "02.svg",
 *       "03.svg",
 *       "04.svg",
 *       "05.svg",
 *       "06.svg"
 *     ]
 *   },
 *   "Always-look-on-the-bright-side": {
 *     "title": "Always look on the bright side of life",
 *     "source": "http://musescore.com/score/158089",
 *     "folder": "/home/jf/git-repositories/content/lieder/a/Always-look-on-the-bright-side",
 *     "slides": [
 *       "01.svg",
 *       "02.svg",
 *       "03.svg",
 *       "04.svg",
 *       "05.svg",
 *       "06.svg"
 *     ]
 *   },
 * </pre></code>
 */
let library

/**
 * The current song
 * <code><pre>
 * {
 *   "title": "Altes Fieber",
 *   "artist": "Die Toten Hosen",
 *   "musescore": "https://musescore.com/user/12559861/scores/4801717",
 *   "folder": "/home/jf/git-repositories/content/lieder/a/Altes-Fieber",
 *   "slides": [
 *     "01.svg",
 *     "02.svg",
 *     "03.svg",
 *     "04.svg",
 *     "05.svg",
 *     "06.svg"
 *   ]
 * }
 * </pre></code>
 */
let song

let selector

let set = function (values) {
  songsPath = values.songsPath
  library = values.library
  selector = values.selector
}

/**
 * Set all properties for the current song.
 *
 * @param {string} songID The ID of the song: The song title, escaped
 *   without special characters and whitespaces
 *   (e. g.: Another-brick-in-the-wall)
 */
let setCurrent = function (songID) {
  song = library[songID]
  if (typeof song !== 'undefined') {
    slideNumber = 0
    slides = song.slides
    slideNumberMax = slides.length - 1
    folder = song.folder
  }
  setSlide()
}

/**
 *
 */
let setSongTitle = function () {
  if (slideNumber === 0 && song.hasOwnProperty('title')) {
    document.getElementById('song-title').style.display = 'block'
    document.getElementById('song-title_title').textContent = song.title
    document.getElementById('song-title_subtitle').textContent = song.subtitle
  } else {
    document.getElementById('song-title').style.display = 'none'
  }
}

/**
 * Load the current image to the slide section.
 */
let setSlide = function () {
  let imagePath = path.join(folder, 'slides', slides[slideNumber])
  document.querySelector(selector).setAttribute('src', imagePath)
  setSongTitle()
}

/**
 * Show the next slide.
 */
let nextSlide = function () {
  slideNumber += 1
  if (slideNumber > slideNumberMax) {
    slideNumber = 0
  }
  setSlide()
}

/**
 * Show the previous slide.
 */
let previousSlide = function () {
  slideNumber -= 1
  if (slideNumber < 0) {
    slideNumber = slideNumberMax
  }
  setSlide()
}

/**
 *
 */
let loadByHash = function () {
  if (location.hash !== '') {
    setCurrent(location.hash.substring(1))
    setSlide()
  }
}

exports.loadByHash = loadByHash
exports.nextSlide = nextSlide
exports.previousSlide = previousSlide
exports.set = set
exports.setCurrent = setCurrent
exports.songsPath = songsPath
