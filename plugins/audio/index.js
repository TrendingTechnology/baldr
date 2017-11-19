const {Howl} = require('howler');

/**
 *
 */
class Audio {
  constructor(document) {
    this.element = 'lol';
  }

  play(fileInfo) {
    this.stop();
    this.current = new Howl({src: [fileInfo.path]});
    this.id = this.current.play();

    if (this.hasOwnProperty('elemMediaInfo')) {
      this.elemMediaInfo.innerHTML = fileInfo.titleSafe;
      this.elemMediaInfo.style.zIndex = 1;
      this.elemMediaInfo.style.visibility = 'visible';
      setTimeout(() => {
        this.elemMediaInfo.style.zIndex = 1;
        this.elemMediaInfo.style.visibility = 'hidden';
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

module.exports = function(document, plugins) {
  return {
    state: {
      audio: new Audio(document)
    },
    Audio: Audio,
    mediaTypesExtensions: ['mp3', 'aac'],

    getDocument: function() {
      return document.body.nodeName;
    },
    getPlugins: function() {
      return plugins;
    }
  };
};
