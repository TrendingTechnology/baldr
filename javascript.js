$(document).ready(function() {
  songs.setLibrary();
  SearchBar.generateDatalist();
  $(document).bind('keydown', 'shortcut', bindShortcuts);
});

function bindShortcuts(shortcut) {

    switch (shortcut.which) {
        // ESC
        case 27:
            SearchBar.toggle();
            break;
        // Cursor left
        case 37:
            song.previousSlide();
            break;

        // Cursor right
        case 39:
            song.nextSlide();
            break;
    }
}


/***********************************************************************
 * Object 'songs': All songs in the songs library.
 **********************************************************************/

/**
 *
 */
var songs = {}

/**
 *
 */
songs.setLibrary = function() {
  var json = (function () {
    var json = null;
    $.ajax({
        'async': false,
        'global': false,
        'url': 'songs.json',
        'dataType': "json",
        'success': function (data) {
            json = data;
        }
    });
    return json;
})();
  songs.library = json;
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
 *
 */
song.setSlide = function(slideNumber) {
  if (! slideNumber) {
    slideNumber = 0
  }

  if (typeof song.meta.folder != 'undefined') {
    var path = '/songs/' + song.meta.folder + '/' + song.meta.files[slideNumber];
    $('#slide img').attr('src', path);
  }
}

/**
 *
 */
song.slideNext = function() {
  song.slideNumber += 1;
  if (song.slideNumber > max_slide_number) {
    song.slideNumber = 0
  }
}

/**
 *
 */
song.slidePrevious = function() {
  song.slideNumber -= 1;
  if (song.slideNumber < 0) {
    song.slideNumber = max_slide_number
  }
}

/***********************************************************************
 * Object 'search': Search bar
 **********************************************************************/

var SearchBar = {};

/**
 * Generate a data list for an text input field containing all songs.
 */
SearchBar.generateDatalist = function() {
    // Get the <datalist> and <input> elements.
    var dataList = document.getElementById('songs');
    var input = document.getElementById('song-search');

    for(key in songs.library){
      // Create a new <option> element.
      var option = document.createElement('option');

      // Set the value using the item in the JSON array.
      option.value = songs.library[key].title;
      option.id = key;
      // Add the <option> element to the <datalist>.
      dataList.appendChild(option);
    }

    // Update the placeholder text.
    input.placeholder = 'e. g.: Freude schöner Götterfunken';
}

/**
 * Hide or show search bar.
 */
SearchBar.toggle = function() {
  var displayState = document.getElementById('search').style.display;
  console.log(displayState);
  if (displayState == 'none') {
    $('#search').show();
    document.getElementById('song-search').focus();
  } else {
    $('#search').hide();
  }
}

/**
 *
 */
function get_selected_song() {
  $('#song-search').on('input', function() {
    var song_title = $(this).val();

    $('#songs').find('option').each(function() {
      if ($(this).val() == song_title) {
        var song_id = $(this).attr('id')
        $('#search').hide();
        song.meta = songs[song_id];
        setSlide();
        $('#slide').show();
      }
    })
  });
}

