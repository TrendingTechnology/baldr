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
        alert("The selected song is '" + song + "'!");
      }
    })
  });
}

function hide_search_section(shortcut) {
  // 83 = 's'
  if (shortcut.which == 83 && shortcut.altKey) {
      $('#section-search').toggle();
   }
}

function hotkey_bindings() {
  $(document).bind('keydown', 'shortcut', hide_search_section);
}

$(document).ready(function() {
  generate_search_list();
  get_selected_song();
  hotkey_bindings();
});

