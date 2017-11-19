const {Howl} = require('howler');
const {Media} = require('baldr-media');
const mousetrap = require('mousetrap');

let mediaTypesExtensions = ['mp3', 'aac'];

/**
 *
 */
class Audio {

  constructor(document) {
    this.element = document.getElementById('media-info');
  }

  play(fileInfo) {
    this.stop();
    this.current = new Howl({src: [fileInfo.path]});
    this.id = this.current.play();

    if (this.hasOwnProperty('element')) {
      this.element.innerHTML = fileInfo.titleSafe;
      this.element.style.zIndex = 1;
      this.element.style.visibility = 'visible';
      setTimeout(() => {
        this.element.style.zIndex = -1;
        this.element.style.visibility = 'hidden';
      }, 2000);
    }
  }

  stop() {
    if (this.hasOwnProperty('current') && this.current.playing()) {
      this.current.stop();
    }
  }

  pausePlay() {
    if (this.hasOwnProperty('current')) {
      if (this.current.playing()) {
        this.current.pause();
      }
      else {
        this.current.play();
      }
    }
  }

  fadeOut() {
    if (this.hasOwnProperty('current') && this.current.playing()) {
      this.current.fade(1, 0, 5000);
    }
  }
}

module.exports = function(document, masters, presentation) {
  let media = new Media(presentation.pwd);
  let audioFiles = media.list('media/audio', mediaTypesExtensions);

  let audio = new Audio(document);

  let playByNo = function(key) {
    audio.play(audioFiles[key.key - 1]);
  };

  if (audioFiles.length > 0) {
    for (let index in audioFiles) {
      let no = Number.parseInt(index) + 1;
      if (typeof window === 'object') {
        mousetrap.bind('alt+' + no, playByNo);
      }
    }
  }
  let _export = {};

  _export.state = {
      audio: audio,
      media: audioFiles
    };

  _export.Audio = Audio;

  _export.mediaTypesExtensions = ['mp3', 'aac'];

  _export.getDocument = function() {
    return document.body.nodeName;
  };

  _export.getPlugins = function() {
    return masters;
  };

  return _export;
};
