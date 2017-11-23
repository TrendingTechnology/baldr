This folder contains all master slides. Each master slide is located
in its own folder. The folder name corresponds to the name of the master
slide.

Each master slide must have a main entry file named `index.js`.
The `ìndex.js` file has the structure of a node module.
This exported functions are hooks:

# All hooks (sorted alphabetically):

* `config`
  * `centerVertically`: boolean
  * `stepSupport`: boolean
  * `theme`: themeName
* `init(document, config)`
* `initSteps(document, slide, config)`
* `initStepsEveryVisit(document, slide, config)`
* `mainHTML(normalizedSlideData, config, document)`
* `modalHTML()`
* `normalizeData(rawSlideData, config)`
* `postSet()`
* `setStepByNo(no, count, stepData)`
