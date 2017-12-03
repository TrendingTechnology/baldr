How to write a bladr master slide: [Interface](module-baldr-application_masters-Master.html)

# JSDoc parameters

## a

* `argv`: `@param {array} argv An array containing the command line arguments.`

## c

* `config`: `@param {module:baldr-library/config~Config} config All configurations of the current presentation session.`

## d

* `document`: `@param {module:baldr-application~Document} document The document object (DOM) of the render process.`

## e

* `env`: `@param {module:baldr-application~Environment} env Low level environment data.`

## m

* `master`: `@param {module:baldr-application/masters~Master} master The normalized master object derived from the master slide.`
* `masterName`: `@param {string} masterName The name of the master slide.`
* `masters`: `@param {module:baldr-application/masters~Masters} masters All available master slides.`
* `mousetrap`: `@param {module:baldr-application~mousetrap} mousetrap The object of shortcut library “mousetrap”.`
* `masterData`: `@param {module:baldr-application/masters~masterData} Normalized master data.`

## n

* `no`: `@param no A integer starting from 1`

## q

* `quickStart`: `@param {module:baldr-application/quick-start~QuickStart} quickStart Object to manage the quick start entries.`

## r

* `rawQuickStartEntry`: `@param {module:baldr-application/quick-start~rawQuickStartEntry} rawQuickStartEntry A raw quick start entry specified in the master slide hooks.`
* `rawSlideData`: `@param {module:baldr-application/slides~rawSlideData} rawSlideData Various types of data to render a slide.`
* `rawSlides`: `@param {array} rawSlides An array of raw slide objects.`

## s

* `slide`: `@param {module:baldr-application/slides~Slide} slide The object representation of one slide.`
* `slideData`: `@param {module:baldr-application/slides~SlideData} slideData Normalized slide data.`
* `slides`: `@param {module:baldr-application/slides~Slides} slides All slide objects of the current presentation session.`
* `slidesSwitcher`: `@param {module:baldr-application/slides-switcher~SlidesSwitcher} slidesSwitcher Object to switch between the slides.`
* `steps`: `@param {module:baldr-application/slides~StepSwitcher} The instantiated object derived from the class “StepSwitcher()”.`

## t

* `themes`: `@param {module:baldr-application/themes~Themes} themes All available themes.`
* `themeName`: `@param {string} themeName The name of a theme.`
