$(document).ready(function() {
  songs.setLibrary();
  bindShortcuts();
});

/**
 * Map some keyboard shortcuts to the corresponding methods.
 */
function bindShortcuts() {
  Mousetrap.bind('#', toc.toggle);
  Mousetrap.bind('left', song.previousSlide);
  Mousetrap.bind('right', song.nextSlide);
}

/**
 * Map some buttons to the corresponding methods.
 */
function bindButtons() {
  $('#menu #menu-toc').click(toc.toggle);
  $('#toc a').click(toc.toggle);
  $('#toc .close').click(toc.toggle);
  $('#slide #previous').click(song.previousSlide);
  $('#slide #next').click(song.nextSlide);
  $('#menu #menu-fullscreen').click(toggleFullScreen);
}

/**
 * Toggle fullscreen in a browser compatible manner.
 *
 * Code from Mozilla net.
 */
function toggleFullScreen() {
  if (!document.fullscreenElement &&    // alternative standard method
      !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement ) {  // current working methods
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    } else if (document.documentElement.msRequestFullscreen) {
      document.documentElement.msRequestFullscreen();
    } else if (document.documentElement.mozRequestFullScreen) {
      document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullscreen) {
      document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }
}

/***********************************************************************
 * Object 'songs': All songs in the songs library.
 **********************************************************************/

var songs = {}

/**
 *
 */
songs.setLibrary = function() {
  $.getJSON('/songbook/songs/songs.json', function(data) {
    songs.library = data;
    song.loadByHash();
    toc.build();
    bindButtons();
    var options = {
      valueNames: [ 'title' ]
    };
    var tocList = new List('toc', options);
  });
}

/***********************************************************************
 * Object 'song': The current song
 **********************************************************************/

var song = {}

/**
 * The current slide number.
 */
song.slideNumber = 0;

/**
 * The biggest slide number.
 */
song.slideNumberMax;

/**
 * Array of all images files of a song.
 */
song.slides;

/**
 * The folder containing the images files.
 */
song.folder;

/**
 * Set all properties for the current song.
 */
song.setCurrent = function(songID) {
  var tmp = songs.library[songID];
  if (typeof tmp != 'undefined') {
    song.slideNumber = 0;
    song.slides = tmp.slides;
    song.slideNumberMax = song.slides.length - 1;
    song.folder = tmp.folder;
  }
}

/**
 * Load the current image to the slide section.
 */
song.setSlide = function() {
  var path = '/songbook/songs/songs/' + song.folder + '/slides/' + song.slides[song.slideNumber];
  $('#slide img').attr('src', path);
}

/**
 * Show the next slide.
 */
song.nextSlide = function() {
  song.slideNumber += 1;
  if (song.slideNumber > song.slideNumberMax) {
    song.slideNumber = 0;
  }
  song.setSlide();
}

/**
 * Show the previous slide.
 */
song.previousSlide = function() {
  song.slideNumber -= 1;
  if (song.slideNumber < 0) {
    song.slideNumber = song.slideNumberMax;
  }
  song.setSlide();
}

/**
 *
 */
song.loadByHash = function() {
  if (location.hash != '') {
    song.setCurrent(location.hash.substring(1));
    song.setSlide();
    $('#slide').show();
  }
  else {
    toc.toggle();
  }
}

window.onhashchange = song.loadByHash;

/***********************************************************************
 * Object 'toc': table of contents
 **********************************************************************/

var toc = {};

toc.build = function() {
  document.getElementById('toc').appendChild(toc.makeList(songs.library));
}

toc.makeList = function(library) {
  var list = document.createElement('ul');
  list.setAttribute('class', 'list');
  for (songID in library) {

    var anchor = document.createElement('a');
    anchor.setAttribute('href', '#' + songID);
    anchor.setAttribute('class', 'title');
    anchor.innerHTML = library[songID].title;

    var item = document.createElement('li');
    item.appendChild(anchor);
    list.appendChild(item);
  }
  return list;
}

/**
 * Hide or show table of contents.
 */
toc.toggle = function() {
  var element = document.getElementById('toc');
  var displayState = element.style.display;
  if (displayState == 'none') {
    element.style.display = 'block';
  } else {
    element.style.display = 'none';
  }
}
