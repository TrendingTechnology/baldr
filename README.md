[![npm](https://img.shields.io/npm/v/baldr.svg)](https://www.npmjs.com/package/baldr)
[![Build Status](https://travis-ci.org/Josef-Friedrich/baldr.svg?branch=master)](https://travis-ci.org/Josef-Friedrich/baldr)

# baldr - BALDUR

A try to write my presentations for school in HTML5, CSS3 and
Javascript using [Electron](https://electron.atom.io/).
Further informations can be found on the
[API documentation site](https://josef-friedrich.github.io/baldr)
of the project.

This repository contains some evaluation and research code.

## About the name `baldr`

![](src/electron-app/icons/256x256.png)

[Baldr](https://en.wikipedia.org/wiki/Baldr) is the name of a nordic
god. He is the of god of light.

# Installation / Building

```
npm install -g lerna
lerna bootstrap
```

# Upgrading

```
sudo npm install -g npm-check-updates
lerna exec "ncu -u"
lerna exec "npm update"
```

# Publishing

```
lerna publish
```

# Testing

This npm commands execute tests:

* `npm test`: All tests
* `npm run untitest`: All unit tests
* `npm run spectron`: All spectron tests
* `npm run standard`: standardjs linting

# Terminology

* `presentation`:
  * `slides`: A ordered list of slides.
    * `slide`: One fullscreen view displayed for an audience.
      * `steps`: A ordered list of display states
        * `step`: A display state of a slide
  * `quickies`: Views in this section are not arranged in the ordered
     list of slides. They can be displayed really quick during the
     presentation by keyboard shortcuts or menu entries.
  * `master`: Each `slide` and `view` is derived from a `master`
  * `media`: All kind of media files (audio, video, image) that are
     located in the same folder as the *.baldr presentation file.

# Shortcuts

* Cursor/Arrow symbol left / right: slides
* Cursor/Arrow symbol up / down: steps

# Structure of the `*.baldr` YAML file format


```yml

---
quickies:

  - title: Camera
    camera: yes
    shortcut: ctrl+c

  - title: Editor
    editor: yes

  - title: Audio
    audio:
    - audios/beethoven.mp3
    - audios/mozart.mp3

  - title: Video
    video:
    - videos/haydn.mp4
    - videos/mozart.mp4

  - title: Google
    website: https://google.com

  - title: wikipedia
    website: https://en.wikipedia.org

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
