var audio = new Audio('files/mozart.mp3');

var stop = function(audio) {
  audio.pause();
  audio.currentTime = 0;
}

var start = function(audio) {
  audio.volume = 1
  audio.play()
  audio.currentTime = 0;
}

function fadeOut(audio){
    var actualVolume = audio.volume;
    console.log(actualVolume)
    var fadeOutInterval = setInterval(function(){
        actualVolume = actualVolume - 0.02;
        if(actualVolume >= 0){
            console.log(actualVolume)
            audio.volume = actualVolume;
        } else {
            audio.pause();
            clearInterval(fadeOutInterval);
        }
    }, 200);
}

// define a handler
function shortCuts(e) {

  if (e.key == 'p') {
    start(audio);
  }

  if (e.key == 's') {
    stop(audio);
  }

  if (e.key == 'f') {
    fadeOut(audio);
  }

}
// register the handler
document.addEventListener('keyup', shortCuts, false);
