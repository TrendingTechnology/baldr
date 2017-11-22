This folder contains all master slides. Each master slide is located
in its own folder. The folder name corresponds to the name of the master
slide.

Each master slide must have a main entry file named `index.js`.
The `ìndex.js` file has the structure of a node module.
This exported functions are hooks:

* `config`
  * `centerVertically`: boolean
  * `stepSupport`: boolean
  * `theme`: themeName
* `normalizeData(data, document)`
* `modalHTML()`
* `mainHTML(data, config, document)`
* `postSet()`
* `setStepByNo(no, count, data)`
* `initSteps(document, data)`
