var sound = new Howl({
  src: ['sample.mp3']
});

Mousetrap.bind('p', function() {sound.play();})
