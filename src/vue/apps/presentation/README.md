[![npm](https://img.shields.io/npm/v/baldr.svg)](https://www.npmjs.com/package/baldr)
[![Build Status](https://travis-ci.org/Josef-Friedrich/baldr.svg?branch=master)](https://travis-ci.org/Josef-Friedrich/baldr)
[![GitHub repo size](https://img.shields.io/github/repo-size/Josef-Friedrich/baldr.svg)](https://github.com/Josef-Friedrich/baldr)

# @bldr/presentation

Part of the [baldr project](https://github.com/Josef-Friedrich/baldr).

## Terminology

* `presentation`:
  * `slides`: A ordered list of slides.
    * `slide`: One fullscreen view displayed for an audience.
      * `steps`: A ordered list of display states
        * `step`: A display state of a slide
  * `master`: Each `slide` and `view` is derived from a `master`
  * `mediaFile`: All kind of media files (audio, video, image) that are
     located in the same folder as the *.baldr presentation file.


## Structure of the `*.baldr.yml` YAML file format


```yml
---
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
