/**
 * @file Master slide “video”
 * @module baldr-master-video
 */

'use strict';

const {Media} = require('baldr-library');

let media, controls, play, stop, rwd, fwd, timerWrapper, timer, timerBar, intervalFwd, intervalRwd;

/**
 * {@see https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Client-side_web_APIs/Video_and_audio_APIs}
 */

function playerSetup(document) {
  media = document.querySelector('video');
  controls = document.querySelector('.controls');

  play = document.querySelector('.play');
  stop = document.querySelector('.stop');
  rwd = document.querySelector('.rwd');
  fwd = document.querySelector('.fwd');

  timerWrapper = document.querySelector('.timer');
  timer = document.querySelector('.timer span');
  timerBar = document.querySelector('.timer div');

  intervalFwd = 0;
  intervalRwd = 0;
}

/**
 *
 */
function addEventListener() {
  play.addEventListener('click', playPauseMedia);
  stop.addEventListener('click', stopMedia);
  media.addEventListener('ended', stopMedia);
  rwd.addEventListener('click', mediaBackward);
  fwd.addEventListener('click', mediaForward);
  media.addEventListener('timeupdate', setTime);
}

/**
 *
 */
function playPauseMedia() {
  if(media.paused) {
    media.play();
    play.classList.remove('fa-play');
    play.classList.add('fa-pause');
  } else {
    media.pause();
    play.classList.remove('fa-pause');
    play.classList.add('fa-play');
  }
}

/**
 *
 */
function stopMedia() {
  media.pause();
  media.currentTime = 0;
  play.setAttribute('data-icon','P');
  rwd.classList.remove('active');
  fwd.classList.remove('active');
  clearInterval(intervalRwd);
  clearInterval(intervalFwd);
}

/**
 *
 */
function mediaBackward() {
  clearInterval(intervalFwd);
  fwd.classList.remove('active');

  if(rwd.classList.contains('active')) {
    rwd.classList.remove('active');
    clearInterval(intervalRwd);
    media.play();
  } else {
    rwd.classList.add('active');
    media.pause();
    intervalRwd = setInterval(windBackward, 200);
  }
}

/**
 *
 */
function mediaForward() {
  clearInterval(intervalRwd);
  rwd.classList.remove('active');

  if(fwd.classList.contains('active')) {
    fwd.classList.remove('active');
    clearInterval(intervalFwd);
    media.play();
  } else {
    fwd.classList.add('active');
    media.pause();
    intervalFwd = setInterval(windForward, 200);
  }
}

/**
 *
 */
function windBackward() {
  if(media.currentTime <= 3) {
    rwd.classList.remove('active');
    clearInterval(intervalRwd);
    stopMedia();
  } else {
    media.currentTime -= 3;
  }
}

/**
 *
 */
function windForward() {

  if(media.currentTime >= media.duration - 3) {
    fwd.classList.remove('active');
    clearInterval(intervalFwd);
    stopMedia();
  } else {
    media.currentTime += 3;
  }
}

/**
 *
 */
function setTime() {
  let minutes = Math.floor(media.currentTime / 60);
  let seconds = Math.floor(media.currentTime - minutes * 60);
  let minuteValue;
  let secondValue;

  if (minutes < 10) {
    minuteValue = '0' + minutes;
  } else {
    minuteValue = minutes;
  }

  if (seconds < 10) {
    secondValue = '0' + seconds;
  } else {
    secondValue = seconds;
  }

  let mediaTime = minuteValue + ':' + secondValue;
  timer.textContent = mediaTime;

  let barLength = timerWrapper.clientWidth * (media.currentTime/media.duration);
  timerBar.style.width = barLength + 'px';
}


/**
 * @see {@link module:baldr-application/masters~Master#normalizeData}
 */
exports.normalizeData = function(rawSlideData, config) {
  return new Media(config.sessionDir)
    .orderedList(rawSlideData, 'video');
};

/**
 * @see {@link module:baldr-application/masters~Master#mainHTML}
 */
exports.mainHTML = function(slide, config, document) {
  let video = slide.masterData[0].path;
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
  </div>`;
};

/**
 * @see {@link module:baldr-application/masters~Master#postSet}
 */
exports.postSet = function(slide, config, document) {
  playerSetup(document);
  addEventListener();
};
