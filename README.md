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
