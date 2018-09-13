currentAudio = {
  'start': function() {},
  'stop': function() {}
}

class AudioButton {

  constructor(audioFile) {
    this.audioFile = audioFile;
    this.button = this.create()
  }

  create() {
    var button = document.createElement('div');
    button.classList.add('baldr-media-player');
    button.classList.add('play');
    button.addEventListener(
      'click',
      function() {this.audioFile.start()}.bind(this),
      false
    );
    return button
  }

  insert(selector) {
    var element = document.querySelector(selector);
    element.parentNode.replaceChild(this.button, element);
  }

  onstart() {
    this.button.classList.replace('play', 'stop')
  }

  onstop() {
    this.button.classList.replace('stop', 'play')
  }
}

class AudioFile {

  constructor(audioFile) {
    this.audio = new Audio(audioFile);
    this.button = new AudioButton(this)
    this.audio.addEventListener('ended', () => {this.button.onstop();});
    this.audio.addEventListener('pause', () => {this.button.onstop();});
    this.audio.addEventListener('play', () => {this.button.onstart();});
  }

  stop() {
    this.audio.pause();
    this.audio.currentTime = 0;
  }

  start() {
    currentAudio.stop()
    this.audio.volume = 1
    this.audio.currentTime = 0;
    this.audio.play()
    currentAudio = this
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

var mozart = new AudioFile('files/mozart.mp3');
mozart.button.insert('baldr-audio#mozart')

var beethoven = new AudioFile('files/beethoven.mp3');
beethoven.button.insert('baldr-audio#beethoven')

// define a handler
function shortCuts(e) {

  if (e.key == 'p') {
    currentAudio.start();
  }

  if (e.key == 's') {
    currentAudio.stop();
  }

  if (e.key == 'f') {
    currentAudio.fadeOut();
  }

}

document.addEventListener('keyup', shortCuts, false);

class AudioPlayer extends HTMLElement {
  constructor() {
    super();

    const shadow = this.attachShadow({mode: 'open'});
    const info = document.createElement('span');
    const text = this.getAttribute('data-text');

    const src = this.getAttribute('src');
    info.textContent = src;

    const style = document.createElement('style');

    style.textContent = `
      span {
        color: red;
      }
    `;

    shadow.appendChild(style);

    shadow.appendChild(info);
  }
}

customElements.define('audio-button', AudioPlayer);
