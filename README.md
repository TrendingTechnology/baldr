[![npm](https://img.shields.io/npm/v/baldr-songbook-updater.svg)](https://www.npmjs.com/package/baldr-songbook-updater)
[![Build Status](https://travis-ci.org/JosefFriedrich-nodejs/baldr-songbook-updater.svg?branch=master)](https://travis-ci.org/JosefFriedrich-nodejs/baldr-songbook-updater)

# baldr-songbook-updater - BALDUR Songbook Updater

A command line utilty to generate from MuseScore files image files for
the BALDUR Songbook.

Further informations can be found on the
[API documentation site](https://joseffriedrich-nodejs.github.io/baldr-songbook-updater/)
of the project.

## Installation

```
sudo npm install --global --unsafe-perm baldr-songbook-updater
```

## Dependencies

Please install this dependenies:

* [mscore-to-eps.sh](https://github.com/JosefFriedrich-shell/mscore-to-eps.sh)
* [MuseScore](https://musescore.org/)
* [pdf2svg](https://github.com/dawbarton/pdf2svg)
* [pdfcrop](https://ctan.org/tex-archive/support/pdfcrop)
* [pdfinfo](https://poppler.freedesktop.org/)
* [pdftops](https://poppler.freedesktop.org/)

## Testing

```
npm install
npm test
```
