/*
 https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Client-side_web_APIs/Video_and_audio_APIs
*/

class VideoPlayer {
  constructor(document) {
    this.media = document.querySelector('video');
    this.controls = document.querySelector('.controls');

    this.play = document.querySelector('.play');
    this.stop = document.querySelector('.stop');
    this.rwd = document.querySelector('.rwd');
    this.fwd = document.querySelector('.fwd');

    this.timerWrapper = document.querySelector('.timer');
    this.timer = document.querySelector('.timer span');
    this.timerBar = document.querySelector('.timer div');

    this.media.removeAttribute('controls');
    this.controls.style.visibility = 'visible';
    this.play.addEventListener('click', this.playPauseMedia);

    this.stop.addEventListener('click', this.stopMedia);
    this.media.addEventListener('ended', this.stopMedia);

    this.rwd.addEventListener('click', this.mediaBackward);
    this.fwd.addEventListener('click', this.mediaForward);

    this.intervalFwd = 0;
    this.intervalRwd = 0;

    this.media.addEventListener('timeupdate', setTime);
  }

  playPauseMedia() {
    if(this.media.paused) {
      this.play.setAttribute('data-icon','u');
      this.media.this.play();
    } else {
      this.play.setAttribute('data-icon','P');
      this.media.pause();
    }
  }

  stopMedia() {
    this.media.pause();
    this.media.currentTime = 0;
    this.play.setAttribute('data-icon','P');
    this.rwd.classList.remove('active');
    this.fwd.classList.remove('active');
    clearInterval(this.intervalRwd);
    clearInterval(this.intervalFwd);
  }

  mediaBackward() {
    clearInterval(this.intervalFwd);
    this.fwd.classList.remove('active');

    if(this.rwd.classList.contains('active')) {
      this.rwd.classList.remove('active');
      clearInterval(this.intervalRwd);
      this.media.this.play();
    } else {
      this.rwd.classList.add('active');
      this.media.pause();
      this.intervalRwd = setInterval(windBackward, 200);
    }
  }

  mediaForward() {
    clearInterval(this.intervalRwd);
    this.rwd.classList.remove('active');

    if(this.fwd.classList.contains('active')) {
      this.fwd.classList.remove('active');
      clearInterval(this.intervalFwd);
      this.media.this.play();
    } else {
      this.fwd.classList.add('active');
      this.media.pause();
      this.intervalFwd = setInterval(windForward, 200);
    }
  }

  windBackward() {
    if(this.media.currentTime <= 3) {
      this.rwd.classList.remove('active');
      clearInterval(this.intervalRwd);
      this.stopMedia();
    } else {
      this.media.currentTime -= 3;
    }
  }

  windForward() {
    if(this.media.currentTime >= this.media.duration - 3) {
      this.fwd.classList.remove('active');
      clearInterval(this.intervalFwd);
      this.stopMedia();
    } else {
      this.media.currentTime += 3;
    }
  }


  setTime() {
    let minutes = Math.floor(this.media.currentTime / 60);
    let seconds = Math.floor(this.media.currentTime - minutes * 60);
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

    this.mediaTime = minuteValue + ':' + secondValue;
    this.timer.textContent = this.mediaTime;

    let barLength = this.timerWrapper.clientWidth * (this.media.currentTime/this.media.duration);
    this.timerBar.style.width = barLength + 'px';
  }
}


exports.mainHTML = function(slide, config, document) {
  return `<div class="this.player">
    <video this.controls>
      <source src="video/sintel-short.mp4" type="video/mp4">
      <source src="video/sintel-short.mp4" type="video/webm">
      <!-- fallback content here -->
    </video>
    <div class="this.controls">
      <button class="this.play" data-icon="P" aria-label="this.play pause toggle"></button>
      <button class="this.stop" data-icon="S" aria-label="this.stop"></button>
      <div class="this.timer">
        <div></div>
        <span aria-label="this.timer">00:00</span>
      </div>
      <button class="this.rwd" data-icon="B" aria-label="rewind"></button>
      <button class="this.fwd" data-icon="F" aria-label="fast forward"></button>
    </div>
  </div>`;
};
