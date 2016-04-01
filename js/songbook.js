$(document).ready(function() {
  songs.setLibrary();
  search.inputListener();
  bindShortcuts();
});

/**
 * Map some keyboard shortcuts to the corresponding methods.
 */
function bindShortcuts() {
  Mousetrap.bind('esc', search.toggle, 'keyup');
  Mousetrap.bind('#', toc.toggle);
  Mousetrap.bind('left', song.previousSlide);
  Mousetrap.bind('right', song.nextSlide);
}

/**
 * Map some buttons to the corresponding methods.
 */
function bindButtons() {
  $('#menu #menu-search').click(search.toggle);
  $('#menu #menu-toc').click(toc.toggle);
  $('#toc a').click(toc.toggle);
  $('#toc .close').click(toc.toggle);
  $('#slide #previous').click(song.previousSlide);
  $('#slide #next').click(song.nextSlide);
  $('#search .close').click(search.toggle);
  $('#menu #menu-fullscreen').click(toggleFullScreen);
}


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
  $.getJSON('/songs.json', function(data) {
    songs.library = data;
    search.generateDatalist();
    song.loadByHash();
    toc.build();
    bindButtons();
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
    song.slides = tmp.files;
    song.slideNumberMax = song.slides.length - 1;
    song.folder = tmp.folder;
  }
}

/**
 * Load the current image to the slide section.
 */
song.setSlide = function() {
  var path = '/songbook/songs/' + song.folder + '/' + song.slides[song.slideNumber];
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
}

window.onhashchange = song.loadByHash;

/***********************************************************************
 * Object 'search': Search bar
 **********************************************************************/

var search = {};

/**
 * Generate a data list for an text input field containing all songs.
 */
search.generateDatalist = function() {
  // Get the <datalist> and <input> elements.
  var dataList = document.getElementById('songs');
  var input = document.getElementById('search-input');

  for (key in songs.library) {
    // Create a new <option> element.
    var option = document.createElement('option');

    // Set the value using the item in the JSON array.
    option.value = songs.library[key].title;
    option.id = key;
    // Add the <option> element to the <datalist>.
    dataList.appendChild(option);
  }

  // Update the placeholder text.
  input.placeholder = 'Nach einem Lied suchen';
}

/**
 * Hide or show search bar.
 */
search.toggle = function() {
  var element = document.getElementById('search');
  var displayState = element.style.display;
  if (displayState == 'none') {
    document.getElementById('toc').style.display = 'none';
    element.style.display = 'block';
    document.getElementById('search-input').focus();
  } else {
    element.style.display = 'none';
  }
}

/**
 * Listen on the input text field.
 */
search.inputListener = function() {
  $('#search-input').on('input', function() {
    var songTitle = $(this).val();

    $('#songs').find('option').each(function() {
      if ($(this).val() == songTitle) {
        var songID = $(this).attr('id');
        song.setCurrent(songID);
        song.setSlide();
        $('#search').hide();
        $('#search-input').val('');
        $('#slide').show();
      }
    })
  });
}

/***********************************************************************
 * Object 'toc': table of contents
 **********************************************************************/

var toc = {};

toc.build = function() {
  document.getElementById('toc').appendChild(toc.makeList(songs.library));
}

toc.makeList = function(library) {
  var list = document.createElement('ul');
  for (songID in library) {

    var anchor = document.createElement('a');
    anchor.setAttribute('href', '#' + songID);
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
    document.getElementById('search').style.display = 'none';
    element.style.display = 'block';
  } else {
    element.style.display = 'none';
  }
}
