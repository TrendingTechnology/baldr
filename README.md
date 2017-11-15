[![Build Status](https://travis-ci.org/JosefFriedrich-nodejs/baldr.svg?branch=master)](https://travis-ci.org/JosefFriedrich-nodejs/baldr)

# baldr - BALDUR

A try to write my presentations for school in HTML5, CSS3 and
Javascript using [Electron](https://electron.atom.io/).
Further informations can be found on the
[API documentation site](https://joseffriedrich-nodejs.github.io/baldr/)
of the project.

This repository contains some evaluation and research code.

## About the name `baldr`

![](build/icons/256x256.png)

[Baldr](https://en.wikipedia.org/wiki/Baldr) is the name of a nordic
god. He is the of god of light.

## Subpackages

`baldr` consists of this subpackages.

* [baldr-dcamr](https://github.com/JosefFriedrich-nodejs/baldr-dcamr):
  A fullscreen electron app to display the video output from document
  cameras.
* [baldr-sbook](https://github.com/JosefFriedrich-nodejs/baldr-sbook):
  A fullscreen electron app to display songs in a class room using a
  projector.
* [baldr-sbook-updtr](https://github.com/JosefFriedrich-nodejs/baldr-sbook-updtr):
  A command line utilty to generate from MuseScore files image files
  for the BALDUR Songbook.

Coding standards following the [Google Javascript Style
Guide](https://google.github.io/styleguide/javascriptguide.xml).

# Installation / Building

```
npm install
npm test
npm run dist
pacman -U dist/baldur-0.0.1.pacman
dpkg -i dist/baldur-0.0.1.deb
```

# Terminology

* `presentation`:
  * `slides`: A ordered list of single slides.
    * `slide`: One fullscreen view displayed for an audience.
      * `steps`: A ordered list of display states
        * `step`: A display state of a slide
  * `general`: Views in this section are not arranged in the order list
     of slides. They can be displayed during the presentation by
     keyboard shortcuts or menu entries.
  * `master`: Each `slide` and `view` is derived from a `master`
  * `media`: All kind of media files (audio, video, image) that are
     located in the same folder as the *.baldr presentation file.

# Shortcuts

* Cursor/Arrow symbol left / right: slides
* Cursor/Arrow symbol up / down: steps

# Structure of the `*.baldr` YAML file format


```yml

---
general:
  camera: yes
  editor: yes
  audio:
    - audios/beethoven.mp3
    - audios/mozart.mp3
  video:
    - videos/haydn.mp4
    - videos/mozart.mp4

slides:

  - audio:
      - media/audio/mozart.mp3
      - media/audio/haydn.mp3
      - media/audio/beethoven.mp3

  - camera: yes

  - editor: yes

  - image: media/image

  - markdown: |
      # heading 1
      ## heading 2
      ### heading 3

  - person:
      name: Ludwig van Beethoven
      image: beethoven.jpg

  - question: When did Ludwig van Beethoven die?

  - quote:
      text: |
        Der Tag der Gunst ist wie der Tag der Ernte,
        man muss geschäftig sein sobald sie reift.
      author: Johann Wolfgang von Goethe
      date: 1801

  - website: https://google.de
```
