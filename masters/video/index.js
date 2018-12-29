/**
 * @file Master slide “video”
 * @module baldr-master-video
 */

'use strict'

const { Media } = require('baldr-library')

/**
 * {@see https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Client-side_web_APIs/Video_and_audio_APIs}
 */
class VideoPlayer {
  constructor (document) {
    this.media = document.querySelector('video')
    this.controls = document.querySelector('.controls')

    this.play = document.querySelector('.play')
    this.stop = document.querySelector('.stop')
    this.rwd = document.querySelector('.rwd')
    this.fwd = document.querySelector('.fwd')

    this.timerWrapper = document.querySelector('.timer')
    this.timer = document.querySelector('.timer span')
    this.timerBar = document.querySelector('.timer div')

    this.play.addEventListener('click', this.playPauseMedia.bind(this))

    this.stop.addEventListener('click', this.stopMedia.bind(this))
    this.media.addEventListener('ended', this.stopMedia.bind(this))

    this.rwd.addEventListener('click', this.mediaBackward.bind(this))
    this.fwd.addEventListener('click', this.mediaForward.bind(this))

    this.intervalFwd = 0
    this.intervalRwd = 0

    this.media.addEventListener('timeupdate', this.setTime.bind(this))
  }

  /**
   *
   */
  playPauseMedia () {
    if (this.media.paused) {
      this.media.play()
      this.play.classList.remove('fa-play')
      this.play.classList.add('fa-pause')
    } else {
      this.media.pause()
      this.play.classList.remove('fa-pause')
      this.play.classList.add('fa-play')
    }
  }

  /**
   *
   */
  stopMedia () {
    this.media.pause()
    this.media.currentTime = 0
    this.play.setAttribute('data-icon', 'P')
    this.rwd.classList.remove('active')
    this.fwd.classList.remove('active')
    clearInterval(this.intervalRwd)
    clearInterval(this.intervalFwd)
  }

  /**
   *
   */
  mediaBackward () {
    clearInterval(this.intervalFwd)
    this.fwd.classList.remove('active')

    if (this.rwd.classList.contains('active')) {
      this.rwd.classList.remove('active')
      clearInterval(this.intervalRwd)
      this.media.this.play()
    } else {
      this.rwd.classList.add('active')
      this.media.pause()
      this.intervalRwd = setInterval(this.windBackward_.bind(this), 200)
    }
  }

  /**
   *
   */
  mediaForward () {
    clearInterval(this.intervalRwd)
    this.rwd.classList.remove('active')

    if (this.fwd.classList.contains('active')) {
      this.fwd.classList.remove('active')
      clearInterval(this.intervalFwd)
      this.media.this.play()
    } else {
      this.fwd.classList.add('active')
      this.media.pause()
      this.intervalFwd = setInterval(this.windForward_.bind(this), 200)
    }
  }

  /**
   *
   */
  windBackward_ () {
    if (this.media.currentTime <= 3) {
      this.rwd.classList.remove('active')
      clearInterval(this.intervalRwd)
      this.stopMedia()
    } else {
      this.media.currentTime -= 3
    }
  }

  /**
   *
   */
  windForward_ () {
    if (this.media.currentTime >= this.media.duration - 3) {
      this.fwd.classList.remove('active')
      clearInterval(this.intervalFwd)
      this.stopMedia()
    } else {
      this.media.currentTime += 3
    }
  }

  /**
   *
   */
  setTime () {
    let minutes = Math.floor(this.media.currentTime / 60)
    let seconds = Math.floor(this.media.currentTime - minutes * 60)
    let minuteValue
    let secondValue

    if (minutes < 10) {
      minuteValue = '0' + minutes
    } else {
      minuteValue = minutes
    }

    if (seconds < 10) {
      secondValue = '0' + seconds
    } else {
      secondValue = seconds
    }

    this.mediaTime = minuteValue + ':' + secondValue
    this.timer.textContent = this.mediaTime

    let barLength = this.timerWrapper.clientWidth * (this.media.currentTime / this.media.duration)
    this.timerBar.style.width = barLength + 'px'
  }
}

/**
 * @see {@link module:baldr-application/masters~Master#normalizeData}
 */
exports.normalizeData = function (rawSlideData, config) {
  return new Media(config.sessionDir)
    .orderedList(rawSlideData, 'video')
}

/**
 * @see {@link module:baldr-application/masters~Master#mainHTML}
 */
exports.mainHTML = function (slide, config, document) {
  let video = slide.masterData[0].path
  return `<div class="player">
    <video>
      <source src="${video}" type="video/mp4">
      <!-- fallback content here -->
    </video>
    <div class="controls">
      <button class="play fa fa-play" aria-label="play pause toggle"></button>
      <button class="stop fa fa-stop" aria-label="stop"></button>
      <div class="timer">
        <div></div>
        <span aria-label="timer">00:00</span>
      </div>
      <button class="rwd fa fa-backward" aria-label="rewind"></button>
      <button class="fwd fa fa-forward" aria-label="fast forward"></button>
    </div>
  </div>`
}

/**
 * @see {@link module:baldr-application/masters~Master#postSet}
 */
exports.postSet = function (slide, config, document) {
  let vid = new VideoPlayer(document)
}
