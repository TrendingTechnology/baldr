How to write a bladr master slide: [Interface](module-@bldr/electron-app_masters-Master.html)

# JSDoc parameters

## a

* `argv`: `@param {array} argv An array containing the command line arguments.`

## c

* `config`: `@param {module:@bldr/library/config~Config} config All configurations of the current presentation session.`

## d

* `document`: `@param {module:@bldr/electron-app~Document} document The document object (DOM) of the render process.`

## e

* `env`: `@param {module:@bldr/electron-app~Environment} env Low level environment data.`

## m

* `master`: `@param {module:@bldr/electron-app/masters~Master} master The normalized master object derived from the master slide.`
* `masterName`: `@param {string} masterName The name of the master slide.`
* `masters`: `@param {module:@bldr/electron-app/masters~Masters} masters All available master slides.`
* `mousetrap`: `@param {module:@bldr/electron-app~mousetrap} mousetrap The object of shortcut library “mousetrap”.`
* `masterData`: `@param {module:@bldr/electron-app/masters~masterData} The normalized master data.`

## n

* `no`: `@param no A integer starting from 1`

## q

* `quickStart`: `@param {module:@bldr/electron-app/quick-start~QuickStart} quickStart Object to manage the quick start entries.`

## r

* `rawQuickStartEntry`: `@param {module:@bldr/electron-app/quick-start~rawQuickStartEntry} rawQuickStartEntry A raw quick start entry specified in the master slide hooks.`
* `rawSlideData`: `@param {module:@bldr/electron-app/slides~rawSlideData} rawSlideData Various types of data to render a slide.`
* `rawSlides`: `@param {array} rawSlides An array of raw slide objects.`
* `rawMasterData`: `@param {module:@bldr/electron-app/masters~rawMasterData} rawMasterData Data in various types to pass to a master slide.`

## s

* `slide`: `@param {module:@bldr/electron-app/slides~Slide} slide The object representation of one slide.`
* `slideData`: `@param {module:@bldr/electron-app/slides~SlideData} slideData Normalized slide data.`
* `slides`: `@param {module:@bldr/electron-app/slides~Slides} slides All slide objects of the current presentation session.`
* `slidesSwitcher`: `@param {module:@bldr/electron-app/slides-switcher~SlidesSwitcher} slidesSwitcher Object to switch between the slides.`
* `steps`: `@param {module:@bldr/electron-app/slides~StepSwitcher} The instantiated object derived from the class “StepSwitcher()”.`

## t

* `themes`: `@param {module:@bldr/electron-app/themes~Themes} themes All available themes.`
* `themeName`: `@param {string} themeName The name of a theme.`
