function generate_search_list() {
  $.getJSON("songs.json", function(songs) {
    // Get the <datalist> and <input> elements.
    var dataList = document.getElementById('songs');
    var input = document.getElementById('song-search');

    // Loop over the JSON array.
    songs.forEach(function(item) {
      // Create a new <option> element.
      var option = document.createElement('option');
      // Set the value using the item in the JSON array.
      option.value = item.title;
      // Add the <option> element to the <datalist>.
      dataList.appendChild(option);
    });

    // Update the placeholder text.
    input.placeholder = "e. g.: Freude schöner Götterfunken";
  });
}

function get_selected_song() {
  $('#song-search').on('input', function() {
    var song = $(this).val();

    $("#songs").find("option").each(function() {
      if ($(this).val() == song) {
        $('#section-search').hide();
        alert("The selected song is '" + song + "'!");
      }
    })
  });
}

function hide_search_section(shortcut) {
  // 27 = 'ESC'
  // 83 = 's'
  var displayState = document.getElementById("section-search").style.display;
  if (shortcut.which == 83 && (displayState == 'none' || displayState == null)) {
    $('#section-search').show();
    document.getElementById("song-search").focus();
  } else if (shortcut.which == 27) {
    $('#section-search').hide();
  }
}

function hotkey_bindings() {
  $(document).bind('keydown', 'shortcut', hide_search_section);
  $(document).bind('keydown', 'shortcut', slide_songs);
}

slideNumber = 0

function slide_songs(shortcut) {
  var songs = [
    "songs/lemon1.svg",
    "songs/lemon2.svg",
    "songs/lemon3.svg",
    "songs/lemon4.svg",
    "songs/lemon5.svg",
    "songs/lemon6.svg",
    "songs/lemon7.svg"
  ]

  // 39 -> right
  // 37 -> left

  if (shortcut.which == 37) {
    slideNumber -= 1;
    if (slideNumber < 0) {
      slideNumber = songs.length - 1
    }
  } else if (shortcut.which == 39) {
    slideNumber += 1;
    if (slideNumber > songs.length - 1) {
      slideNumber = 0
    }
  }

  $("#image-screen img").attr('src', songs[slideNumber]);
}

$(document).ready(function() {
  generate_search_list();
  get_selected_song();
  hotkey_bindings();
});

