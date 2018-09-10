class BaldrAudio {

  constructor(audioFile) {
    this.audio = new Audio(audioFile);
    this.playButton = this.createButton()
  }

  createButton() {
    var button = document.createElement('div');
    button.classList.add('baldr-media-player');
    button.classList.add('play');
    button.id = 'baldr-media-1';
    button.addEventListener("click", function() {this.start()}.bind(this), false);
    return button
  }

  insertButton(selector) {
    var el = document.querySelector(selector);
    el.parentNode.replaceChild(this.playButton, el);
  }

  stop() {
    this.audio.pause();
    this.audio.currentTime = 0;
  }

  start() {
    this.audio.volume = 1
    this.audio.currentTime = 0;
    this.audio.play()
  }

  fadeOut(duration=3.1){
    var actualVolume = this.audio.volume;
    var steps = actualVolume / 100
    // in milliseconds: duration * 1000 / 100
    var delay = duration * 10
    var fadeOutInterval = setInterval(() => {
      actualVolume -= steps;
      if (actualVolume >= 0) {
        this.audio.volume = actualVolume.toFixed(2);
      }
      else {
        this.stop();
        clearInterval(fadeOutInterval);
      }
    }, parseInt(delay));
  }

}

var audio = new BaldrAudio('files/mozart.mp3');

// define a handler
function shortCuts(e) {

  if (e.key == 'p') {
    audio.start();
  }

  if (e.key == 's') {
    audio.stop();
  }

  if (e.key == 'f') {
    audio.fadeOut();
  }

}

// register the handler
document.addEventListener('keyup', shortCuts, false);

audio.insertButton('baldr-audio')
