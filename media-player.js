
class AudioButton {

  constructor(baldrAudio) {
    this.baldrAudio = baldrAudio;
    this.button = this.create()
  }

  create() {
    var button = document.createElement('div');
    button.classList.add('baldr-media-player');
    button.classList.add('play');
    button.id = 'baldr-media-1';
    button.addEventListener(
      'click',
      function() {this.baldrAudio.start()}.bind(this),
      false
    );
    return button
  }

  insert(selector) {
    var el = document.querySelector(selector);
    el.parentNode.replaceChild(this.button, el);
  }

  onstart() {
    this.button.classList.replace('play', 'stop')
  }

  onstop() {
    this.button.classList.replace('stop', 'play')
  }
}

class BaldrAudio {

  constructor(audioFile) {
    this.audio = new Audio(audioFile);
    this.button = new AudioButton(this)

    this.audio.addEventListener(
      'ended',
      function() {
        this.button.onstop();
      }.bind(this),
      false
    );

    this.audio.addEventListener(
      'play',
      function() {
        this.button.onstart();
      }.bind(this),
      false
    );
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

audio.button.insert('baldr-audio')
