[![npm](https://img.shields.io/npm/v/baldr.svg)](https://www.npmjs.com/package/baldr)
[![Build Status](https://travis-ci.org/Josef-Friedrich/baldr.svg?branch=master)](https://travis-ci.org/Josef-Friedrich/baldr)
[![GitHub repo size](https://img.shields.io/github/repo-size/Josef-Friedrich/baldr.svg)](https://github.com/Josef-Friedrich/baldr)

# baldr

A try to write my presentations for school in HTML5, CSS3 and
Javascript using [Electron](https://electron.atom.io/).
Further informations can be found on the
[API documentation site](https://josef-friedrich.github.io/baldr)
of the project.

This repository contains some evaluation and research code.

## About the name `baldr`

![](src/vue/components/material-icon/src/icons/baldr.svg)

[Baldr](https://en.wikipedia.org/wiki/Baldr) is the name of a nordic
god. He is the of god of light.

## Installation / Building

```
npm install -g lerna
lerna bootstrap
```

## Upgrading

```
sudo npm install -g npm-check-updates
lerna exec "ncu -u"
lerna exec "npm update"
```

## Sort package.json

```
sudo npm install -g sort-package-json
lerna exec "sort-package-json"
```

## Publishing

```
lerna publish
```

## Testing

This npm commands execute tests:

* `npm test`: All tests
* `npm run untitest`: All unit tests
* `npm run spectron`: All spectron tests
* `npm run standard`: standardjs linting

## Coding style

### Imports

#### Node packages

```js
// Node packages.
const path = require('path')

// Third party packages.
const jquery = require('jquery')

// Project packages.
const { bootstrapConfig, Library, AlphabeticalSongsTree } = require('@bldr/songbook-base')
```

#### Vue imports

```js
// Vue components.
import StartPage from './views/StartPage.vue'
```

### Private fields

https://google.github.io/styleguide/jsguide.html#features-classes-fields

```js
class Foo {
  constructor() {
    this.bar_ = computeBar()
  }
}
```

### vue

#### Component name

* At least two words
* `MyComponent.vue` (Pascal Case)
* `name: 'MyComponent'` (Pascal Case)
* Top level Vue component css class, prefix with `vc` = Vue component: Snake Case
  * HTML: `class="vc_my_component"`
  * CSS: `.vc_my_component`
