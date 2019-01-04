/* globals Audio HTMLElement customElements */

let currentAudio = {
  'start': function () {},
  'stop': function () {}
}

class AudioFile {
  constructor (audioFile) {
    this.audio = new Audio(audioFile)
  }

  stop () {
    this.audio.pause()
    this.audio.currentTime = 0
  }

  start () {
    currentAudio.stop()
    this.audio.volume = 1
    this.audio.currentTime = 0
    this.audio.play()
    currentAudio = this
  }

  fadeOut (duration = 3.1) {
    var actualVolume = this.audio.volume
    var steps = actualVolume / 100
    // in milliseconds: duration * 1000 / 100
    var delay = duration * 10
    var fadeOutInterval = setInterval(() => {
      actualVolume -= steps
      if (actualVolume >= 0) {
        this.audio.volume = actualVolume.toFixed(2)
      } else {
        this.stop()
        clearInterval(fadeOutInterval)
      }
    }, parseInt(delay))
  }
}

// var mozart = new AudioFile('files/mozart.mp3');
// mozart.button.insert('baldr-audio#mozart')
//
// var beethoven = new AudioFile('files/beethoven.mp3');
// beethoven.button.insert('baldr-audio#beethoven')

// define a handler
function shortCuts (e) {
  if (e.key === 'p') {
    currentAudio.start()
  }

  if (e.key === 's') {
    currentAudio.stop()
  }

  if (e.key === 'f') {
    currentAudio.fadeOut()
  }
}

document.addEventListener('keyup', shortCuts, false)

class AudioButton extends HTMLElement {
  constructor () {
    super()

    const shadow = this.attachShadow({ mode: 'open' })
    this.button = document.createElement('div')
    this.button.classList.add('button')
    this.button.classList.add('play')

    const info = document.createElement('div')

    const src = this.getAttribute('src')
    this.audioFile = new AudioFile(src)
    console.log(this.audioFile)
    this.audioFile.audio.addEventListener('ended', () => { this.onstop_() })
    this.audioFile.audio.addEventListener('pause', () => { this.onstop_() })
    this.audioFile.audio.addEventListener('play', () => { this.onplay_() })
    this.addEventListener('click', () => { this.audioFile.start() })

    const style = document.createElement('style')

    style.textContent = `
      .button {
        background-size: contain;
        width: 100px;
        height: 100px;
      }

      .play {
        background-image: url('assets/play.svg');
      }

      .stop {
        background-image: url('assets/stop.svg');
      }
    `

    shadow.appendChild(style)
    shadow.appendChild(this.button)

    shadow.appendChild(info)
  }

  insert (selector) {
    var element = document.querySelector(selector)
    element.parentNode.replaceChild(this.button, element)
  }

  onplay_ () {
    this.button.classList.replace('play', 'stop')
  }

  onstop_ () {
    this.button.classList.replace('stop', 'play')
  }
}

customElements.define('audio-button', AudioButton)
