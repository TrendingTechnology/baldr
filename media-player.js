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
    var fadeOutInterval = setInterval(function(){
        actualVolume -= 0.01;
        if(actualVolume >= 0){
            audio.volume = actualVolume.toFixed(2);
            console.log(audio.volume)
        } else {
            audio.pause();
            console.log('pause')
            clearInterval(fadeOutInterval);
        }
    }, 30);
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
