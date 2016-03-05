/**
 * Contains the songs.json file.
 */
var songs = {}

/**
 * The current song to view.
 */
var song = {}
song.slideNumber = 0;

$(document).ready(function() {
  get_songs();
  generate_search_list();
  get_selected_song();
  hotkey_bindings();
});

function get_songs() {
  $.getJSON("songs.json", function(songs) {
    window.songs = songs;
  });
}

function generate_search_list() {
  $.getJSON("songs.json", function(songs) {
    // Get the <datalist> and <input> elements.
    var dataList = document.getElementById('songs');
    var input = document.getElementById('song-search');

    for(key in songs){
      // Create a new <option> element.
      var option = document.createElement('option');

      // Set the value using the item in the JSON array.
      option.value = songs[key].title;
      option.id = key;
      // Add the <option> element to the <datalist>.
      dataList.appendChild(option);
    }

    // Update the placeholder text.
    input.placeholder = "e. g.: Freude schöner Götterfunken";
  });
}

function get_selected_song() {
  $('#song-search').on('input', function() {
    var song_title = $(this).val();

    $("#songs").find("option").each(function() {
      if ($(this).val() == song_title) {
        var song_id = $(this).attr("id")
        $('#search').hide();
        song.meta = songs[song_id];
        setSlide();
        $('#slide').show();
      }
    })
  });
}

function hide_search_section(shortcut) {
  // 27 = 'ESC'
  // 83 = 's'
  var displayState = document.getElementById("search").style.display;
  if (shortcut.which == 83 && (displayState == 'none' || displayState == null)) {
    $('#search').show();
    document.getElementById("song-search").focus();
  } else if (shortcut.which == 27) {
    $('#search').hide();
  }
}

function hotkey_bindings() {
  $(document).bind('keydown', 'shortcut', hide_search_section);
  $(document).bind('keydown', 'shortcut', slide_songs);
}

function slide_songs(shortcut) {
  // 39 -> right
  // 37 -> left

  var max_slide_number = song.meta.files.length - 1

  if (shortcut.which == 37) {
    song.slideNumber -= 1;
    if (song.slideNumber < 0) {
      song.slideNumber = max_slide_number
    }
  } else if (shortcut.which == 39) {
    song.slideNumber += 1;
    if (song.slideNumber > max_slide_number) {
      song.slideNumber = 0
    }
  }
  setSlide(song.slideNumber);
}

function setSlide(slideNumber) {
  if (! slideNumber) {
    slideNumber = 0
  }
  var path = "/songs/" + song.meta.folder + "/" + song.meta.files[slideNumber];
  $("#slide img").attr('src', path);
}

